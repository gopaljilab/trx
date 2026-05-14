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
    let theme_colors = app.config.current_theme();
    let vertical_root = Layout::vertical([
        Constraint::Length(1), // Help header
        Constraint::Length(3), // Tabs
        Constraint::Min(1),    // Content
        Constraint::Length(1), // Status Bar
    ]);
    let [help_area_root, tabs_area, content_area, status_area] = vertical_root.areas(frame.area());

    draw_help_header(frame, app, help_area_root);
    draw_tabs(frame, app, tabs_area, &theme_colors);

    if let crate::ui::app::Tab::Settings = app.current_tab {
        draw_settings_tab(frame, app, content_area, &theme_colors);
    } else {
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
            draw_search_input(frame, app, i_area, &theme_colors);
        }

        draw_package_list(frame, app, list_area, &theme_colors);
        draw_details(frame, app, details_area, &theme_colors);
    }
    
    draw_status_bar(frame, app, status_area, &theme_colors);

    if app.show_help {
        draw_help_overlay(frame, app, &theme_colors);
    }

    if app.update_prompt.is_some() {
        draw_update_prompt(frame, app, &theme_colors);
    }

    if let Some((msg, color)) = &app.popup_message {
        draw_popup(frame, msg, *color, &theme_colors);
    }
}

fn draw_update_prompt(frame: &mut Frame, app: &App, theme: &crate::config::Theme) {
    let area = centered_rect(40, 20, frame.area());
    frame.render_widget(Clear, area);

    let (version, _) = app.update_prompt.as_ref().unwrap();
    let current_version = env!("CARGO_PKG_VERSION");
    let success_color = app.config.get_color(&theme.success_color);
    let error_color = app.config.get_color(&theme.error_color);

    let text = vec![
        Line::from(vec![Span::raw(format!("Version {} -> {}", current_version, version))]),
        Line::from(""),
        Line::from("Do you want to update?"),
        Line::from(""),
        Line::from(vec![
            if app.update_selected_yes {
                Span::styled(" [ Yes ] ", Style::default().bg(success_color).fg(Color::Black).add_modifier(Modifier::BOLD))
            } else {
                Span::raw(" [ Yes ] ")
            },
            Span::raw("    "),
            if !app.update_selected_yes {
                Span::styled(" [ No ] ", Style::default().bg(error_color).fg(Color::Black).add_modifier(Modifier::BOLD))
            } else {
                Span::raw(" [ No ] ")
            },
        ]),
    ];

    let paragraph = Paragraph::new(text)
        .block(Block::bordered().title("Update Available").border_type(BorderType::Thick).border_style(Style::default().fg(app.config.get_color(&theme.border_color))))
        .alignment(ratatui::layout::Alignment::Center);

    frame.render_widget(paragraph, area);
}

fn draw_help_header(frame: &mut Frame, app: &App, area: Rect) {
    let keys = &app.config.keys;
    let (help_lines, style) = match app.input_mode {
        InputMode::Normal => (
            vec![
                "Press ".into(),
                keys.quit.clone().bold(),
                " to quit, ".into(),
                keys.search_edit.clone().bold(),
                " to edit, ".into(),
                keys.tab_next.clone().bold(),
                "/".into(),
                keys.tab_prev.clone().bold(),
                " to switch tabs, ".into(),
                keys.help.clone().bold(),
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

fn draw_tabs(frame: &mut Frame, app: &App, area: Rect, theme: &crate::config::Theme) {
    let highlight_color = app.config.get_color(&theme.highlight_color);

    let tab_titles = vec!["Search", "Installed", "Updates", "Settings"];
    let tabs = ratatui::widgets::Tabs::new(tab_titles)
        .block(Block::bordered().title("Views").border_style(Style::default().fg(app.config.get_color(&theme.border_color))))
        .select(match app.current_tab {
            crate::ui::app::Tab::Search => 0,
            crate::ui::app::Tab::Installed => 1,
            crate::ui::app::Tab::Updates => 2,
            crate::ui::app::Tab::Settings => 3,
        })
        .highlight_style(Style::default().fg(highlight_color).add_modifier(Modifier::BOLD));
    frame.render_widget(tabs, area);
}

fn draw_popup(frame: &mut Frame, msg: &str, color: Color, _theme: &crate::config::Theme) {
    let area = centered_rect(30, 10, frame.area());
    frame.render_widget(Clear, area);
    
    let block = Block::bordered()
        .border_style(Style::default().fg(color))
        .border_type(BorderType::Double);
    
    let paragraph = Paragraph::new(Span::styled(msg, Style::default().fg(color).add_modifier(Modifier::BOLD)))
        .block(block)
        .alignment(ratatui::layout::Alignment::Center);
    
    frame.render_widget(paragraph, area);
}

fn draw_settings_tab(frame: &mut Frame, app: &App, area: Rect, theme: &crate::config::Theme) {
    let highlight_color = app.config.get_color(&theme.highlight_color);
    let border_color = app.config.get_color(&theme.border_color);
    let primary_color = app.config.get_color(&theme.text_primary);
    let secondary_color = app.config.get_color(&theme.text_secondary);

    let mut settings_lines = Vec::new();

    // Config Path (Not interactive)
    if let Some(proj_dirs) = directories::ProjectDirs::from("", "", "trx") {
        let config_path = proj_dirs.config_dir().join("config.toml");
        settings_lines.push(Line::from(vec![
            Span::styled("  Config Path: ", Style::default().fg(highlight_color).add_modifier(Modifier::BOLD)),
            Span::raw(config_path.to_string_lossy().to_string()),
        ]));
        settings_lines.push(Line::from(""));
    }

    // Helper macro for settings
    macro_rules! draw_setting {
        ($idx:expr, $label:expr, $value:expr, $is_toggle:expr) => {
            let style = if app.settings_index == $idx {
                Style::default().fg(highlight_color).add_modifier(Modifier::BOLD)
            } else {
                Style::default().fg(primary_color)
            };

            let indicator = if app.settings_index == $idx { "> " } else { "  " };
            let val_span = if $is_toggle {
                if $value == "true" || $value == "enabled" {
                    Span::styled(format!("[{}]", $value), Style::default().fg(app.config.get_color(&theme.success_color)))
                } else {
                    Span::styled(format!("[{}]", $value), Style::default().fg(app.config.get_color(&theme.error_color)))
                }
            } else {
                let mut val_text = $value.to_string();
                if app.settings_index == $idx && matches!(app.input_mode, InputMode::Editing) {
                    val_text = format!("{}█", app.input);
                }
                Span::styled(val_text, Style::default().fg(secondary_color))
            };

            settings_lines.push(Line::from(vec![
                Span::styled(indicator, style),
                Span::styled(format!("{:<20}: ", $label), style),
                val_span,
            ]));
        };
    }

    // Settings
    settings_lines.push(Line::from(Span::styled("--- General ---", Style::default().fg(highlight_color).add_modifier(Modifier::BOLD))));
    draw_setting!(0, "AUR Helper", &app.config.aur_helper, false);
    draw_setting!(1, "Auto Update Check", if app.config.settings.auto_update_check { "true" } else { "false" }, true);
    draw_setting!(2, "Search Debounce", &format!("{}ms", app.config.settings.search_debounce_ms), false);
    draw_setting!(3, "Default Tab", &app.config.settings.default_tab, false);
    draw_setting!(4, "Max Results", &app.config.settings.max_search_results.to_string(), false);
    settings_lines.push(Line::from(""));

    let mut current_idx = 5;

    // Managers
    settings_lines.push(Line::from(Span::styled("--- Managers ---", Style::default().fg(highlight_color).add_modifier(Modifier::BOLD))));
    for m in &app.available_managers {
        let enabled = app.config.settings.enabled_managers.contains(m);
        draw_setting!(current_idx, &format!("Enable {}", m), if enabled { "enabled" } else { "disabled" }, true);
        current_idx += 1;
    }
    settings_lines.push(Line::from(""));

    // Theme
    settings_lines.push(Line::from(Span::styled("--- Theme ---", Style::default().fg(highlight_color).add_modifier(Modifier::BOLD))));
    draw_setting!(current_idx, "Theme Preset", &app.config.theme_name, false);
    current_idx += 1;
    
    if app.config.theme_name == "Custom" {
        if let Some(ref ct) = app.config.custom_theme {
            draw_setting!(current_idx, "Border Color", &ct.border_color, false);
            draw_setting!(current_idx + 1, "Highlight Color", &ct.highlight_color, false);
            draw_setting!(current_idx + 2, "Success Color", &ct.success_color, false);
            draw_setting!(current_idx + 3, "Error Color", &ct.error_color, false);
            draw_setting!(current_idx + 4, "Text Primary", &ct.text_primary, false);
            draw_setting!(current_idx + 5, "Text Secondary", &ct.text_secondary, false);
        }
    }

    let paragraph = Paragraph::new(settings_lines)
        .block(Block::bordered()
            .title("Settings (Enter/Space to Toggle or Edit, Arrows for Themes)")
            .border_style(Style::default().fg(border_color)))
        .wrap(Wrap { trim: false });

    frame.render_widget(paragraph, area);
}


fn draw_search_input(frame: &mut Frame, app: &App, area: Rect, theme: &crate::config::Theme) {
    let highlight_color = app.config.get_color(&theme.highlight_color);
    let border_color = app.config.get_color(&theme.border_color);

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
        crate::ui::app::Tab::Settings => "Settings".to_string(),
    };

    let input = Paragraph::new(app.input.as_str())
        .style(match app.input_mode {
            InputMode::Normal => Style::default().fg(app.config.get_color(&theme.text_primary)),
            InputMode::Editing => Style::default().fg(highlight_color),
        })
        .block(Block::bordered()
            .title(search_title)
            .border_style(Style::default().fg(border_color)));
    frame.render_widget(input, area);

    if let InputMode::Editing = app.input_mode {
        frame.set_cursor_position(Position::new(
            area.x + app.character_index as u16 + 1,
            area.y + 1,
        ));
    }
}

fn draw_package_list(frame: &mut Frame, app: &mut App, area: Rect, theme: &crate::config::Theme) {
    let border_color = app.config.get_color(&theme.border_color);
    let success_color = app.config.get_color(&theme.success_color);
    let secondary_color = app.config.get_color(&theme.text_secondary);
    let primary_color = app.config.get_color(&theme.text_primary);

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
                    Span::styled("[*]", Style::default().fg(success_color).add_modifier(Modifier::BOLD))
                } else {
                    Span::raw("[ ]")
                };

                let installed_indicator = if app.installed_packages.contains(&p.name) {
                    Span::styled("(I) ", Style::default().fg(success_color))
                } else {
                    Span::raw("    ")
                };

                let content = Line::from(vec![
                    checked_symbol,
                    Span::raw(" "),
                    installed_indicator,
                    Span::styled(format!("{:<28}", pkg_name), Style::default().fg(primary_color).add_modifier(Modifier::BOLD)),
                    Span::styled(format!("{:<20}", version), Style::default().fg(success_color)),
                    Span::styled(provider, Style::default().fg(secondary_color)),
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
        .block(Block::bordered()
            .title(list_title)
            .border_style(Style::default().fg(border_color)))
        .highlight_style(Style::default().bg(app.config.get_color("blue")).fg(Color::White))
        .highlight_symbol("» ");

    frame.render_stateful_widget(list, area, &mut app.list_state);

    // Render scrollbar
    if !app.packages.is_empty() {
        let scrollbar = ratatui::widgets::Scrollbar::default()
            .orientation(ratatui::widgets::ScrollbarOrientation::VerticalRight)
            .begin_symbol(Some("↑"))
            .end_symbol(Some("↓"));
        let mut scrollbar_state = ratatui::widgets::ScrollbarState::new(app.packages.len())
            .position(app.selected);
        frame.render_stateful_widget(
            scrollbar,
            area.inner(ratatui::layout::Margin { vertical: 1, horizontal: 0 }),
            &mut scrollbar_state,
        );
    }
}

fn draw_details(frame: &mut Frame, app: &App, area: Rect, theme: &crate::config::Theme) {
    let highlight_color = app.config.get_color(&theme.highlight_color);
    let border_color = app.config.get_color(&theme.border_color);
    let error_color = app.config.get_color(&theme.error_color);
    let primary_color = app.config.get_color(&theme.text_primary);

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
                Span::styled("Error: ", Style::default().fg(error_color)),
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

                let value_wrapped = wrap(value, (area.width as usize).saturating_sub(key_text.len() + 2));

                if let Some(first) = value_wrapped.get(0) {
                    details_lines.push(Line::from(vec![
                        Span::styled(
                            key_text.clone(),
                            Style::default()
                                .fg(highlight_color)
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

    let total_lines = details_lines.len();
    let paragraph = Paragraph::new(details_lines)
        .scroll((app.details_scroll, 0))
        .style(Style::default().fg(primary_color))
        .block(Block::bordered()
            .title("Details")
            .border_style(Style::default().fg(border_color)));

    frame.render_widget(paragraph, area);

    // Render scrollbar for details
    if total_lines > area.height as usize {
        let scrollbar = ratatui::widgets::Scrollbar::default()
            .orientation(ratatui::widgets::ScrollbarOrientation::VerticalRight);
        let mut scrollbar_state = ratatui::widgets::ScrollbarState::new(total_lines)
            .position(app.details_scroll as usize);
        frame.render_stateful_widget(
            scrollbar,
            area.inner(ratatui::layout::Margin { vertical: 1, horizontal: 0 }),
            &mut scrollbar_state,
        );
    }
}

fn draw_status_bar(frame: &mut Frame, app: &App, area: Rect, theme: &crate::config::Theme) {
    let highlight_color = app.config.get_color(&theme.highlight_color);
    let success_color = app.config.get_color(&theme.success_color);

    let mode_str = match app.input_mode {
        InputMode::Normal => "NORMAL",
        InputMode::Editing => "EDITING",
    };
    
    let selected_count = app.selected_names.len();

    let status_line = Line::from(vec![
        Span::styled(format!(" {} ", mode_str), Style::default().bg(app.config.get_color("blue")).fg(Color::Black).add_modifier(Modifier::BOLD)),
        Span::raw(" | "),
        Span::styled(format!("Mgr: {} ", app.manager.name()), Style::default().fg(success_color)),
        Span::raw("| "),
        Span::styled(format!("Selected: {} ", selected_count), Style::default().fg(highlight_color)),
        Span::raw("| "),
        Span::styled("?: Help | i: Install | x: Remove | U: Upgrade", Style::default().fg(Color::DarkGray)),
    ]);

    frame.render_widget(Paragraph::new(status_line), area);
}

fn draw_help_overlay(frame: &mut Frame, app: &App, theme: &crate::config::Theme) {
    let area = centered_rect(60, 50, frame.area());
    frame.render_widget(Clear, area);
    let keys = &app.config.keys;
    let highlight_color = app.config.get_color(&theme.highlight_color);

    let help_text = vec![
        Line::from(vec![Span::styled("Keybindings", Style::default().add_modifier(Modifier::BOLD))]),
        Line::from(""),
        Line::from(vec![Span::styled(keys.quit.clone(), Style::default().fg(highlight_color)), Span::raw(": Quit")]),
        Line::from(vec![Span::styled(keys.search_edit.clone(), Style::default().fg(highlight_color)), Span::raw(": Edit Search")]),
        Line::from(vec![Span::styled("Esc", Style::default().fg(highlight_color)), Span::raw(": Normal Mode")]),
        Line::from(vec![Span::styled(format!("{} / {}", keys.tab_next, keys.tab_prev), Style::default().fg(highlight_color)), Span::raw(": Switch Tabs")]),
        Line::from(vec![Span::styled(if keys.toggle_select == " " { "Space".into() } else { keys.toggle_select.clone() }, Style::default().fg(highlight_color)), Span::raw(": Select/Unselect")]),
        Line::from(vec![Span::styled(keys.install.clone(), Style::default().fg(highlight_color)), Span::raw(": Install Selected")]),
        Line::from(vec![Span::styled(keys.remove.clone(), Style::default().fg(highlight_color)), Span::raw(": Remove Selected")]),
        Line::from(vec![Span::styled(keys.system_upgrade.clone(), Style::default().fg(highlight_color)), Span::raw(": Full System Upgrade")]),
        Line::from(vec![Span::styled(keys.refresh_db.clone(), Style::default().fg(highlight_color)), Span::raw(": Refresh Databases")]),
        Line::from(vec![Span::styled("Up / Down / j / k", Style::default().fg(highlight_color)), Span::raw(": Move")]),
        Line::from(vec![Span::styled(keys.help.clone(), Style::default().fg(highlight_color)), Span::raw(": Toggle Help")]),
    ];
    frame.render_widget(
        Paragraph::new(help_text)
            .block(Block::bordered()
                .title("Help")
                .border_type(BorderType::Double)
                .border_style(Style::default().fg(app.config.get_color(&theme.border_color))))
            .wrap(Wrap { trim: true }),
        area,
    );
}