use ratatui::{
    Frame,
    layout::{Constraint, Layout, Position, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Clear, List, ListItem, Paragraph, Wrap},
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

/// draw_ui updated to accept a mutable App reference so it can use App.list_state.
pub fn draw_ui(frame: &mut Frame, app: &mut App) {
    let vertical_root = Layout::vertical([
        Constraint::Length(1), // Help
        Constraint::Length(3), // Tabs
        Constraint::Min(1),    // Content
    ]);
    let [help_area_root, tabs_area, content_area] = vertical_root.areas(frame.area());

    // Help area
    let (help_lines, style) = match app.input_mode {
        InputMode::Normal => (
            vec![
                "Press ".into(),
                "q".bold(),
                " to quit, ".into(),
                "e".bold(),
                " to edit, ".into(),
                "Tab".bold(),
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
    frame.render_widget(Paragraph::new(text), help_area_root);

    // Tabs
    let tab_titles = vec!["Search", "Installed", "Updates"];
    let tabs = ratatui::widgets::Tabs::new(tab_titles)
        .block(Block::bordered().title("Views"))
        .select(match app.current_tab {
            crate::ui::app::Tab::Search => 0,
            crate::ui::app::Tab::Installed => 1,
            crate::ui::app::Tab::Updates => 2,
        })
        .highlight_style(
            Style::default()
                .fg(Color::Yellow)
                .add_modifier(Modifier::BOLD),
        );
    frame.render_widget(tabs, tabs_area);

    let horizontal = Layout::horizontal([Constraint::Percentage(50), Constraint::Percentage(50)]);
    let [search_area, details_area] = horizontal.areas(content_area);

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

    let search_title = match app.current_tab {
        crate::ui::app::Tab::Search => {
            if app.loading {
                "Search [Searching...]"
            } else {
                "Search"
            }
        }
        crate::ui::app::Tab::Installed => "Installed Packages",
        crate::ui::app::Tab::Updates => "Available Updates",
    };

    // Only show input in Search tab
    if let Some(i_area) = input_area {
        let input = Paragraph::new(app.input.as_str())
            .style(match app.input_mode {
                InputMode::Normal => Style::default(),
                InputMode::Editing => Style::default().fg(Color::Yellow),
            })
            .block(Block::bordered().title(search_title));
        frame.render_widget(input, i_area);
    }

    // Build items (use packages if available; otherwise, fallback to messages)

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
                    let slice = &name[..14]; // now the slice lives long enough
                    format!("{}...", slice)
                } else {
                    name.to_string()
                };
                // correct name
                //let provider = if parts.len() > 1 { parts[0] } else { "pacman" };

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

    // Create a List with a highlight style and symbol
    let list_title = format!("Packages ({})", app.manager.name());
    let list = List::new(items)
        .block(Block::bordered().title(list_title))
        .highlight_style(Style::default().bg(Color::Blue).fg(Color::White))
        .highlight_symbol("» ");

    frame.render_stateful_widget(list, list_area, &mut app.list_state);
    let mut details_lines: Vec<Line> = Vec::new();

    match &app.details_state {
        crate::ui::app::DetailsState::Empty => {
            details_lines.push(Line::from("No package selected"));
        }
        crate::ui::app::DetailsState::Loading => {
            details_lines.push(Line::from("Loading details..."));
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

                // Remaining lines => indent + rest of value
                for line in value_wrapped.iter().skip(1) {
                    details_lines.push(Line::from(format!("{}{}", indent, line)));
                }
            }
        }
    }

    // Now render
    frame.render_widget(
        Paragraph::new(details_lines)
            .wrap(Wrap { trim: false })
            .block(Block::bordered().title("Details")),
        details_area,
    );

    if let InputMode::Editing = app.input_mode {
        if let Some(i_area) = input_area {
            frame.set_cursor_position(Position::new(
                i_area.x + app.character_index as u16 + 1,
                i_area.y + 1,
            ));
        }
    }

    if app.show_help {
        let area = centered_rect(60, 40, frame.area());
        frame.render_widget(Clear, area); // This clears out the background
        let help_text = vec![
            Line::from(vec![Span::styled(
                "Keybindings",
                Style::default().add_modifier(Modifier::BOLD),
            )]),
            Line::from(""),
            Line::from(vec![
                Span::styled("q", Style::default().fg(Color::Yellow)),
                Span::raw(": Quit"),
            ]),
            Line::from(vec![
                Span::styled("e", Style::default().fg(Color::Yellow)),
                Span::raw(": Edit Search (Search tab only)"),
            ]),
            Line::from(vec![
                Span::styled("Esc", Style::default().fg(Color::Yellow)),
                Span::raw(": Normal Mode"),
            ]),
            Line::from(vec![
                Span::styled("Tab", Style::default().fg(Color::Yellow)),
                Span::raw(": Switch Tabs"),
            ]),
            Line::from(vec![
                Span::styled("Space", Style::default().fg(Color::Yellow)),
                Span::raw(": Select/Unselect"),
            ]),
            Line::from(vec![
                Span::styled("i", Style::default().fg(Color::Yellow)),
                Span::raw(": Install Selected"),
            ]),
            Line::from(vec![
                Span::styled("x", Style::default().fg(Color::Yellow)),
                Span::raw(": Remove Selected"),
            ]),
            Line::from(vec![
                Span::styled("U", Style::default().fg(Color::Yellow)),
                Span::raw(": Full System Upgrade"),
            ]),
            Line::from(vec![
                Span::styled("R", Style::default().fg(Color::Yellow)),
                Span::raw(": Refresh Databases"),
            ]),
            Line::from(vec![
                Span::styled("j / Down", Style::default().fg(Color::Yellow)),
                Span::raw(": Move Down"),
            ]),
            Line::from(vec![
                Span::styled("k / Up", Style::default().fg(Color::Yellow)),
                Span::raw(": Move Up"),
            ]),
            Line::from(vec![
                Span::styled("?", Style::default().fg(Color::Yellow)),
                Span::raw(": Toggle Help"),
            ]),
        ];
        frame.render_widget(
            Paragraph::new(help_text)
                .block(Block::bordered().title("Help"))
                .wrap(Wrap { trim: true }),
            area,
        );
    }
}
