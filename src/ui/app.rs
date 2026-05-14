use crate::ui::{draw::draw_ui, input::InputMode};

use color_eyre::Result;
use ratatui::{
    DefaultTerminal,
    crossterm::event::{self, Event, KeyCode, KeyEventKind},
    widgets::ListState,
};
use std::collections::HashSet;
use std::sync::Arc;
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use std::time::{Duration, Instant};

use crate::managers::{self, Package};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Tab {
    Search,
    Installed,
    Updates,
}

#[derive(Debug, Clone, PartialEq)]
pub enum DetailsState {
    Empty,
    Loading,
    Success(std::collections::HashMap<String, String>),
    Error(String),
}

pub struct App {
    pub input: String,
    pub character_index: usize,
    pub input_mode: InputMode,
    pub current_tab: Tab,
    pub packages: Vec<Package>,
    pub checked: Vec<bool>,
    pub selected_names: HashSet<String>,
    pub installed_packages: HashSet<String>,
    pub selected: usize,
    pub list_state: ListState,
    pub messages: Vec<String>,
    pub loading: bool,
    pub details_state: DetailsState,
    pub last_selected: usize,
    pub show_help: bool,
    pub update_prompt: Option<(String, String)>, // (version, url)
    pub update_selected_yes: bool,
    pub should_update: Option<String>, // if user said yes, url to update
    pub spinner_tick: u8,
    pub manager: Arc<Box<dyn managers::PackageManager>>,
    result_tx: Sender<(String, Vec<Package>)>,
    result_rx: Receiver<(String, Vec<Package>)>,
    details_tx: Sender<DetailsState>,
    details_rx: Receiver<DetailsState>,
    update_rx: Receiver<Option<(String, String)>>,
    last_input_time: Instant,
    pending_search: bool,
    last_search_query: String,
}

impl App {
    pub fn new(result_tx: Sender<(String, Vec<Package>)>, result_rx: Receiver<(String, Vec<Package>)>) -> Self {
        let mut list_state = ListState::default();
        list_state.select(None);

        let (details_tx, details_rx) = std::sync::mpsc::channel();
        let (update_tx, update_rx) = std::sync::mpsc::channel();
        
        // Spawn parallel update check
        thread::spawn(move || {
            let res = crate::updater::check_for_updates();
            let _ = update_tx.send(res);
        });

        let config = crate::config::Config::load();
        let manager = Arc::new(managers::get_system_manager(&config));

        Self {
            input: String::new(),
            input_mode: InputMode::Normal,
            current_tab: Tab::Search,
            messages: Vec::new(),
            character_index: 0,
            packages: Vec::new(),
            checked: Vec::new(),
            selected_names: HashSet::new(),
            installed_packages: manager.get_installed(),
            selected: 0,
            list_state,
            loading: false,
            details_state: DetailsState::Empty,
            last_selected: usize::MAX,
            show_help: false,
            update_prompt: None,
            update_selected_yes: true,
            should_update: None,
            spinner_tick: 0,
            manager,
            result_tx,
            result_rx,
            details_tx,
            details_rx,
            update_rx,
            last_input_time: Instant::now(),
            pending_search: false,
            last_search_query: String::new(),
        }
    }

    fn move_cursor_left(&mut self) {
        let new_index = self.character_index.saturating_sub(1);
        self.character_index = self.clamp_cursor(new_index);
    }

    fn move_cursor_right(&mut self) {
        let new_index = self.character_index.saturating_add(1);
        self.character_index = self.clamp_cursor(new_index);
    }

    fn byte_index(&self) -> usize {
        self.input
            .char_indices()
            .map(|(i, _)| i)
            .nth(self.character_index)
            .unwrap_or(self.input.len())
    }

    fn clamp_cursor(&self, new_pos: usize) -> usize {
        new_pos.clamp(0, self.input.chars().count())
    }

    fn enter_char(&mut self, new_char: char) {
        let index = self.byte_index();
        self.input.insert(index, new_char);
        self.move_cursor_right();

        self.last_input_time = Instant::now();
        self.pending_search = true;
    }

    fn delete_char(&mut self) {
        if self.character_index != 0 {
            let left = self.character_index - 1;
            let before = self.input.chars().take(left);
            let after = self.input.chars().skip(self.character_index);
            self.input = before.chain(after).collect();
            self.move_cursor_left();

            self.last_input_time = Instant::now();
            self.pending_search = true;
        }
    }

    fn check_and_execute_search(&mut self) {
        const DEBOUNCE_MS: u64 = 200;

        if self.pending_search
            && self.last_input_time.elapsed() >= Duration::from_millis(DEBOUNCE_MS)
        {
            let query = self.input.trim().to_string();

            if !query.is_empty() && query != self.last_search_query {
                self.last_search_query = query.clone();
                self.pending_search = false;
                self.loading = true;

                let tx = self.result_tx.clone();
                let manager = self.manager.clone();
                let q_clone = query.clone();

                thread::spawn(move || {
                    let all = manager.search(&q_clone);
                    let _ = tx.send((q_clone, all));
                });
            } else if query.is_empty() {
                self.pending_search = false;
                self.packages.clear();
                self.messages.clear();
                self.loading = false;
            }
        }
    }
    fn run_command(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if self.selected_names.is_empty() {
            return Ok(());
        }

        self.manager.install(terminal, &self.selected_names)
    }

    fn run_remove_command(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if self.selected_names.is_empty() {
            return Ok(());
        }

        let mut to_remove = HashSet::new();
        for name in &self.selected_names {
            if self.installed_packages.contains(name) {
                to_remove.insert(name.clone());
            }
        }

        if !to_remove.is_empty() {
            self.manager.remove(terminal, &to_remove)?;
        }

        Ok(())
    }

    fn switch_tab(&mut self) {
        self.current_tab = match self.current_tab {
            Tab::Search => Tab::Installed,
            Tab::Installed => Tab::Updates,
            Tab::Updates => Tab::Search,
        };

        self.reset_tab_state();
    }

    fn switch_tab_previous(&mut self) {
        self.current_tab = match self.current_tab {
            Tab::Search => Tab::Updates,
            Tab::Installed => Tab::Search,
            Tab::Updates => Tab::Installed,
        };

        self.reset_tab_state();
    }

    fn reset_tab_state(&mut self) {
        self.packages.clear();
        self.messages.clear();
        self.checked.clear();
        self.last_search_query.clear();
        self.selected = 0;
        self.list_state.select(None);
        self.details_state = DetailsState::Empty;

        match self.current_tab {
            Tab::Search => {
                self.pending_search = true;
            }
            Tab::Installed => {
                self.loading = true;
                let tx = self.result_tx.clone();
                let manager = self.manager.clone();
                thread::spawn(move || {
                    let pkgs = manager.get_installed_details();
                    let _ = tx.send(("__INSTALLED__".to_string(), pkgs));
                });
            }
            Tab::Updates => {
                self.loading = true;
                let tx = self.result_tx.clone();
                let manager = self.manager.clone();
                thread::spawn(move || {
                    let pkgs = manager.get_updates();
                    let _ = tx.send(("__UPDATES__".to_string(), pkgs));
                });
            }
        }
    }

    fn trigger_details_fetch(&mut self) {
        if self.packages.is_empty() || self.selected >= self.packages.len() {
            self.details_state = DetailsState::Empty;
            return;
        }

        if self.selected == self.last_selected {
            return;
        }

        let pkg = self.packages[self.selected].clone();
        let tx = self.details_tx.clone();
        let manager = self.manager.clone();
        self.last_selected = self.selected;
        self.details_state = DetailsState::Loading;

        thread::spawn(move || {
            let info = manager.get_details(&pkg.name, &pkg.provider);
            if let Some(details) = info {
                let _ = tx.send(DetailsState::Success(details));
            } else {
                let _ = tx.send(DetailsState::Error("Failed to fetch details".to_string()));
            }
        });
    }

    pub fn run(mut self, terminal: &mut DefaultTerminal) -> Result<Option<String>> {
        loop {
            if let Tab::Search = self.current_tab {
                self.check_and_execute_search();
            }

            if self.loading || matches!(self.details_state, DetailsState::Loading) {
                self.spinner_tick = self.spinner_tick.wrapping_add(1);
            }

            // check for update prompt response
            if self.update_prompt.is_none() && self.should_update.is_none() {
                if let Ok(Some(update)) = self.update_rx.try_recv() {
                    self.update_prompt = Some(update);
                }
            }

            // check search results
            while let Ok((q, pkgs)) = self.result_rx.try_recv() {
                let is_current_tab_result = match self.current_tab {
                    Tab::Search => q == self.input.trim(),
                    Tab::Installed => q == "__INSTALLED__",
                    Tab::Updates => q == "__UPDATES__",
                };

                if is_current_tab_result {
                    self.packages = pkgs;

                    self.checked = self
                        .packages
                        .iter()
                        .map(|p| self.selected_names.contains(&p.name))
                        .collect();

                    self.selected = 0;
                    self.last_selected = usize::MAX; // Reset to trigger details for first item
                    self.loading = false;

                    if !self.packages.is_empty() {
                        self.list_state.select(Some(0));
                        self.trigger_details_fetch();
                    } else {
                        self.list_state.select(None);
                        self.details_state = DetailsState::Empty;
                    }

                    self.messages = self
                        .packages
                        .iter()
                        .map(|p| format!("{} {:<15} {}", p.name, p.version, p.description))
                        .collect();
                }
            }

            // check details results
            if let Ok(state) = self.details_rx.try_recv() {
                self.details_state = state;
            }

            terminal.draw(|frame| draw_ui(frame, &mut self))?;

            if event::poll(std::time::Duration::from_millis(10))? {
                let ev = event::read()?;
                match ev {
                    Event::Key(key) => {
                        if self.update_prompt.is_some() {
                            if key.kind == KeyEventKind::Press {
                                match key.code {
                                    KeyCode::Left
                                    | KeyCode::Right
                                    | KeyCode::Tab
                                    | KeyCode::Char('h')
                                    | KeyCode::Char('l') => {
                                        self.update_selected_yes = !self.update_selected_yes;
                                    }
                                    KeyCode::Enter => {
                                        let (_, url) = self.update_prompt.take().unwrap();
                                        if self.update_selected_yes {
                                            return Ok(Some(url));
                                        }
                                    }
                                    KeyCode::Esc | KeyCode::Char('q') => {
                                        self.update_prompt = None;
                                    }
                                    _ => {}
                                }
                            }
                            continue;
                        }

                        match self.input_mode {
                            InputMode::Normal if key.kind == KeyEventKind::Press => match key.code {
                            KeyCode::BackTab => {
                                self.switch_tab_previous();
                                self.last_selected = usize::MAX;
                                self.trigger_details_fetch();
                            }
                            KeyCode::Tab => {
                                self.switch_tab();
                                self.last_selected = usize::MAX;
                                self.trigger_details_fetch();
                            }
                            KeyCode::Char('i') => {
                                let _ = self.run_command(terminal);
                                // Refresh installed status after install
                                self.installed_packages = self.manager.get_installed();
                                if let Tab::Installed = self.current_tab {
                                    self.packages = self.manager.get_installed_details();
                                }
                            }
                            KeyCode::Char('x') => {
                                let _ = self.run_remove_command(terminal);
                                // Refresh
                                self.installed_packages = self.manager.get_installed();
                                if let Tab::Installed = self.current_tab {
                                    self.packages = self.manager.get_installed_details();
                                }
                            }
                            KeyCode::Char('U') => {
                                let _ = self.manager.system_upgrade(terminal);
                                self.installed_packages = self.manager.get_installed();
                                if let Tab::Updates = self.current_tab {
                                    self.packages = self.manager.get_updates();
                                }
                            }
                            KeyCode::Char('R') => {
                                let _ = self.manager.refresh_databases(terminal);
                                if let Tab::Updates = self.current_tab {
                                    self.packages = self.manager.get_updates();
                                }
                            }
                            KeyCode::Char(' ') => {
                                if !self.packages.is_empty() {
                                    let pkg = &self.packages[self.selected];
                                    let name = pkg.name.clone();

                                    let is_checked = !self.checked[self.selected];
                                    self.checked[self.selected] = is_checked;

                                    if is_checked {
                                        self.selected_names.insert(name);
                                    } else {
                                        self.selected_names.remove(&name);
                                    }
                                }
                            }
                            KeyCode::Char('e') => self.input_mode = InputMode::Editing,
                            KeyCode::Char('q') => return Ok(None),
                            KeyCode::Char('?') => self.show_help = !self.show_help,

                            KeyCode::Up | KeyCode::Char('k') => {
                                if self.selected > 0 {
                                    self.selected -= 1;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            KeyCode::Down | KeyCode::Char('j') => {
                                if self.selected + 1 < self.packages.len() {
                                    self.selected += 1;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            KeyCode::Home => {
                                if !self.packages.is_empty() {
                                    self.selected = 0;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            KeyCode::End => {
                                if !self.packages.is_empty() {
                                    self.selected = self.packages.len() - 1;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            KeyCode::PageUp => {
                                if self.selected > 0 {
                                    // Move up by 10 items, or to the top
                                    self.selected = self.selected.saturating_sub(10);
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            KeyCode::PageDown => {
                                if !self.packages.is_empty() && self.selected + 1 < self.packages.len() {
                                    // Move down by 10 items, or to the bottom
                                    self.selected = (self.selected + 10).min(self.packages.len() - 1);
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            _ => {}
                        },

                        InputMode::Editing if key.kind == KeyEventKind::Press => match key.code {
                            KeyCode::Enter => {
                                self.input_mode = InputMode::Normal;
                                self.pending_search = true;
                                self.last_input_time = Instant::now();
                            }
                            KeyCode::Char(c) => self.enter_char(c),
                            KeyCode::Backspace => self.delete_char(),
                            KeyCode::Left => self.move_cursor_left(),
                            KeyCode::Right => self.move_cursor_right(),
                            KeyCode::Esc => self.input_mode = InputMode::Normal,
                            _ => {}
                        }

                        _ => {}
                    }
                    }
                    Event::Mouse(mouse_event) => {
                        match mouse_event.kind {
                            event::MouseEventKind::ScrollDown => {
                                if self.selected + 1 < self.packages.len() {
                                    self.selected += 1;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            event::MouseEventKind::ScrollUp => {
                                if self.selected > 0 {
                                    self.selected -= 1;
                                    self.list_state.select(Some(self.selected));
                                    self.trigger_details_fetch();
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
        }
    }
}
