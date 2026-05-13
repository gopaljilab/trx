use ratatui::{
    Frame,
    layout::{Constraint, Layout, Position, Rect, Direction},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, List, ListItem, Paragraph, Wrap, Clear, BorderType},
};

use crate::ui::{app::App, input::InputMode};
use textwrap::wrap;

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let popup_layout = Layout::vertical([
        Constraint::Percentage((100 - percent_y) / 2),
        Constraint::Percentage(percent_y),
        Constraint::Percentage((100 - percent_y) / 2),
    ])
    .split(r);

    Layout::horizontal([
        Constraint::Percentage((100 - percent_x) / 2),
        Constraint::Percentage(percent_x),
        Constraint::Percentage((100 - percent_x) / 2),
    ])
    .split(popup_layout[1])[1]
}

const SPINNERS: [&str; 10] = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

pub fn draw_ui(frame: &mut Frame, app: &mut App) {
    let vertical_root = Layout::vertical([
        Constraint::Length(1), // Help header
        Constraint::Length(3), // Tabs
        Constraint::Min(1),    // Content
        Constraint::Length(1), // Status Bar
    ]);
    let [help_area_root, tabs_area, content_area, status_area] = vertical_root.areas(frame.area());

    draw_help_header(frame, app, help_area_root);
    draw_tabs(frame, app, tabs_area);

    // Responsive layout for content area
    let is_wide = content_area.width >= 100;
    let constraints = if is_wide {
        [Constraint::Percentage(50), Constraint::Percentage(50)]
    } else {
        [Constraint::Percentage(60), Constraint::Percentage(40)]
    };
    let direction = if is_wide { Direction::Horizontal } else { Direction::Vertical };

    let content_layout = Layout::new(direction, constraints).split(content_area);
    let search_area = content_layout[0];
    let details_area = content_layout[1];

    let (input_area, list_area) = if let crate::ui::app::Tab::Search = app.current_tab {
        let vertical_search = Layout::vertical([
            Constraint::Length(3), // Input
            Constraint::Min(1),    // List
        ]);
        let [i, l] = vertical_search.areas(search_area);
        (Some(i), l)
    } else {
        (None, search_area)
    };

    if let Some(i_area) = input_area {
        draw_search_input(frame, app, i_area);
    }

    draw_package_list(frame, app, list_area);
    draw_details(frame, app, details_area);
    draw_status_bar(frame, app, status_area);

    if app.show_help {
        draw_help_overlay(frame, app);
    }
}

fn draw_help_header(frame: &mut Frame, app: &App, area: Rect) {
    let (help_lines, style) = match app.input_mode {
        InputMode::Normal => (
            vec![
                "Press ".into(),
                "q".bold(),
                " to quit, ".into(),
                "e".bold(),
                " to edit, ".into(),
                "Tab".bold(),
                "/".into(),
                "Shift+Tab".bold(),
                " to switch tabs, ".into(),
                "?".bold(),
                " for help".into(),
            ],
            Style::default().add_modifier(Modifier::RAPID_BLINK),
        ),
        InputMode::Editing => (
            vec![
                "Press ".into(),
                "Esc".bold(),
                " to stop editing, ".into(),
                "Enter".bold(),
                " to submit".into(),
            ],
            Style::default(),
        ),
    };

    let text = Text::from(Line::from(help_lines)).patch_style(style);
    frame.render_widget(Paragraph::new(text), area);
}

fn draw_tabs(frame: &mut Frame, app: &App, area: Rect) {
    let tab_titles = vec!["Search", "Installed", "Updates"];
    let tabs = ratatui::widgets::Tabs::new(tab_titles)
        .block(Block::bordered().title("Views"))
        .select(match app.current_tab {
            crate::ui::app::Tab::Search => 0,
            crate::ui::app::Tab::Installed => 1,
            crate::ui::app::Tab::Updates => 2,
        })
        .highlight_style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD));
    frame.render_widget(tabs, area);
}

fn draw_search_input(frame: &mut Frame, app: &App, area: Rect) {
    let spinner = if app.loading {
        SPINNERS[(app.spinner_tick as usize / 5) % SPINNERS.len()]
    } else {
        ""
    };

    let search_title = match app.current_tab {
        crate::ui::app::Tab::Search => {
            if app.loading {
                format!("Search [{}]", spinner)
            } else {
                "Search".to_string()
            }
        }
        crate::ui::app::Tab::Installed => "Installed Packages".to_string(),
        crate::ui::app::Tab::Updates => "Available Updates".to_string(),
    };

    let input = Paragraph::new(app.input.as_str())
        .style(match app.input_mode {
            InputMode::Normal => Style::default(),
            InputMode::Editing => Style::default().fg(Color::Yellow),
        })
        .block(Block::bordered().title(search_title));
    frame.render_widget(input, area);

    if let InputMode::Editing = app.input_mode {
        frame.set_cursor_position(Position::new(
            area.x + app.character_index as u16 + 1,
            area.y + 1,
        ));
    }
}

fn draw_package_list(frame: &mut Frame, app: &mut App, area: Rect) {
    let items: Vec<ListItem> = if app.packages.is_empty() {
        app.messages
            .iter()
            .enumerate()
            .map(|(i, m)| ListItem::new(Line::from(Span::raw(format!("{i}: {m}")))))
            .collect()
    } else {
        app.packages
            .iter()
            .enumerate()
            .map(|(_i, p)| {
                let parts: Vec<&str> = p.name.split('/').collect();
                let name = parts.last().unwrap();
                let pkg_name = if name.len() > 16 {
                    format!("{}...", &name[..14])
                } else {
                    name.to_string()
                };

                let provider = format!("{}", &p.provider);
                let version = if p.version.len() > 12 {
                    format!("{}...", &p.version[..8])
                } else {
                    p.version.clone()
                };

                let checked_symbol = if app.selected_names.contains(&p.name) {
                    Span::styled(
                        "[*]",
                        Style::default()
                            .fg(Color::Green)
                            .add_modifier(Modifier::BOLD),
                    )
                } else {
                    Span::raw("[ ]")
                };

                let installed_indicator = if app.installed_packages.contains(&p.name) {
                    Span::styled("(I) ", Style::default().fg(Color::Green))
                } else {
                    Span::raw("    ")
                };

                let content = Line::from(vec![
                    checked_symbol,
                    Span::raw(" "),
                    installed_indicator,
                    Span::styled(
                        format!("{:<28}", pkg_name),
                        Style::default().add_modifier(Modifier::BOLD),
                    ),
                    Span::styled(
                        format!("{:<20}", version),
                        Style::default().fg(Color::Green),
                    ),
                    Span::styled(provider, Style::default().fg(Color::Cyan)),
                ]);

                ListItem::new(content)
            })
            .collect::<Vec<ListItem>>()
    };

    let spinner = if app.loading {
        SPINNERS[(app.spinner_tick as usize / 5) % SPINNERS.len()]
    } else {
        ""
    };

    let list_title = if app.loading && !matches!(app.current_tab, crate::ui::app::Tab::Search) {
        format!("Packages ({}) [{}]", app.manager.name(), spinner)
    } else {
        format!("Packages ({})", app.manager.name())
    };

    let list = List::new(items)
        .block(Block::bordered().title(list_title))
        .highlight_style(Style::default().bg(Color::Blue).fg(Color::White))
        .highlight_symbol("» ");

    frame.render_stateful_widget(list, area, &mut app.list_state);
}

fn draw_details(frame: &mut Frame, app: &App, area: Rect) {
    let mut details_lines: Vec<Line> = Vec::new();
    let spinner = SPINNERS[(app.spinner_tick as usize / 5) % SPINNERS.len()];

    match &app.details_state {
        crate::ui::app::DetailsState::Empty => {
            details_lines.push(Line::from("No package selected"));
        }
        crate::ui::app::DetailsState::Loading => {
            details_lines.push(Line::from(format!("Loading details... {}", spinner)));
        }
        crate::ui::app::DetailsState::Error(err) => {
            details_lines.push(Line::from(vec![
                Span::styled("Error: ", Style::default().fg(Color::Red)),
                Span::raw(err),
            ]));
        }
        crate::ui::app::DetailsState::Success(info) => {
            let mut sorted: Vec<_> = info.iter().collect();
            sorted.sort_by_key(|(k, _)| *k);

            let key_width = 15; // fixed width for keys

            for (key, value) in sorted {
                let key_text = format!("{:<key_width$}: ", key, key_width = key_width);
                let indent = " ".repeat(key_text.len());

                let value_wrapped = wrap(value, 80 - key_text.len());

                if let Some(first) = value_wrapped.get(0) {
                    details_lines.push(Line::from(vec![
                        Span::styled(
                            key_text.clone(),
                            Style::default()
                                .fg(Color::Yellow)
                                .add_modifier(Modifier::BOLD),
                        ),
                        Span::raw(first.to_string()),
                    ]));
                }

                for line in value_wrapped.iter().skip(1) {
                    details_lines.push(Line::from(format!("{}{}", indent, line)));
                }
            }
        }
    }

    frame.render_widget(
        Paragraph::new(details_lines)
            .wrap(Wrap { trim: false })
            .block(Block::bordered().title("Details")),
        area,
    );
}

fn draw_status_bar(frame: &mut Frame, app: &App, area: Rect) {
    let mode_str = match app.input_mode {
        InputMode::Normal => "NORMAL",
        InputMode::Editing => "EDITING",
    };
    
    let selected_count = app.selected_names.len();

    let status_line = Line::from(vec![
        Span::styled(format!(" {} ", mode_str), Style::default().bg(Color::Blue).fg(Color::Black).add_modifier(Modifier::BOLD)),
        Span::raw(" | "),
        Span::styled(format!("Mgr: {} ", app.manager.name()), Style::default().fg(Color::Green)),
        Span::raw("| "),
        Span::styled(format!("Selected: {} ", selected_count), Style::default().fg(Color::Yellow)),
        Span::raw("| "),
        Span::styled("?: Help | i: Install | x: Remove | U: Upgrade", Style::default().fg(Color::DarkGray)),
    ]);

    frame.render_widget(Paragraph::new(status_line), area);
}

fn draw_help_overlay(frame: &mut Frame, _app: &App) {
    let area = centered_rect(60, 50, frame.area());
    frame.render_widget(Clear, area);
    let help_text = vec![
        Line::from(vec![Span::styled("Keybindings", Style::default().add_modifier(Modifier::BOLD))]),
        Line::from(""),
        Line::from(vec![Span::styled("q", Style::default().fg(Color::Yellow)), Span::raw(": Quit")]),
        Line::from(vec![Span::styled("e", Style::default().fg(Color::Yellow)), Span::raw(": Edit Search (Search tab only)")]),
        Line::from(vec![Span::styled("Esc", Style::default().fg(Color::Yellow)), Span::raw(": Normal Mode")]),
        Line::from(vec![Span::styled("Tab / Shift+Tab", Style::default().fg(Color::Yellow)), Span::raw(": Switch Tabs")]),
        Line::from(vec![Span::styled("Space", Style::default().fg(Color::Yellow)), Span::raw(": Select/Unselect")]),
        Line::from(vec![Span::styled("i", Style::default().fg(Color::Yellow)), Span::raw(": Install Selected")]),
        Line::from(vec![Span::styled("x", Style::default().fg(Color::Yellow)), Span::raw(": Remove Selected")]),
        Line::from(vec![Span::styled("U", Style::default().fg(Color::Yellow)), Span::raw(": Full System Upgrade")]),
        Line::from(vec![Span::styled("R", Style::default().fg(Color::Yellow)), Span::raw(": Refresh Databases")]),
        Line::from(vec![Span::styled("Up / Down / j / k", Style::default().fg(Color::Yellow)), Span::raw(": Move")]),
        Line::from(vec![Span::styled("PageUp / PageDown", Style::default().fg(Color::Yellow)), Span::raw(": Fast Move")]),
        Line::from(vec![Span::styled("Home / End", Style::default().fg(Color::Yellow)), Span::raw(": Jump to top/bottom")]),
        Line::from(vec![Span::styled("Scroll Wheel", Style::default().fg(Color::Yellow)), Span::raw(": Move")]),
        Line::from(vec![Span::styled("?", Style::default().fg(Color::Yellow)), Span::raw(": Toggle Help")]),
    ];
    frame.render_widget(
        Paragraph::new(help_text)
            .block(Block::bordered().title("Help").border_type(BorderType::Double))
            .wrap(Wrap { trim: true }),
        area,
    );
}