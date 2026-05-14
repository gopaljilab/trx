use serde::{Deserialize, Serialize};
use std::fs;
use directories::ProjectDirs;
use ratatui::style::Color;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub search_debounce_ms: u64,
    pub auto_update_check: bool,
    pub default_tab: String,
    pub max_search_results: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Keys {
    pub quit: String,
    pub install: String,
    pub remove: String,
    pub search_edit: String,
    pub toggle_select: String,
    pub tab_next: String,
    pub tab_prev: String,
    pub system_upgrade: String,
    pub refresh_db: String,
    pub help: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Theme {
    pub border_color: String,
    pub highlight_color: String,
    pub success_color: String,
    pub error_color: String,
    pub text_primary: String,
    pub text_secondary: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub aur_helper: String,
    pub settings: Settings,
    pub keys: Keys,
    pub theme: Theme,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            aur_helper: "yay".to_string(),
            settings: Settings {
                search_debounce_ms: 200,
                auto_update_check: true,
                default_tab: "Search".to_string(),
                max_search_results: 50,
            },
            keys: Keys {
                quit: "q".to_string(),
                install: "i".to_string(),
                remove: "x".to_string(),
                search_edit: "e".to_string(),
                toggle_select: " ".to_string(),
                tab_next: "Tab".to_string(),
                tab_prev: "BackTab".to_string(),
                system_upgrade: "U".to_string(),
                refresh_db: "R".to_string(),
                help: "?".to_string(),
            },
            theme: Theme {
                border_color: "blue".to_string(),
                highlight_color: "yellow".to_string(),
                success_color: "green".to_string(),
                error_color: "red".to_string(),
                text_primary: "white".to_string(),
                text_secondary: "cyan".to_string(),
            },
        }
    }
}

impl Config {
    pub fn load() -> Self {
        if let Some(proj_dirs) = ProjectDirs::from("", "", "trx") {
            let config_dir = proj_dirs.config_dir();
            let config_path = config_dir.join("config.toml");

            if config_path.exists() {
                if let Ok(content) = fs::read_to_string(config_path) {
                    if let Ok(config) = toml::from_str(&content) {
                        return config;
                    }
                }
            } else {
                // Create default config
                let _ = fs::create_dir_all(config_dir);
                let _ = fs::write(&config_path, toml::to_string(&Self::default()).unwrap());
            }
        }
        Self::default()
    }

    pub fn get_color(&self, color_name: &str) -> Color {
        match color_name.to_lowercase().as_str() {
            "black" => Color::Black,
            "red" => Color::Red,
            "green" => Color::Green,
            "yellow" => Color::Yellow,
            "blue" => Color::Blue,
            "magenta" => Color::Magenta,
            "cyan" => Color::Cyan,
            "gray" => Color::Gray,
            "dark_gray" => Color::DarkGray,
            "light_red" => Color::LightRed,
            "light_green" => Color::LightGreen,
            "light_yellow" => Color::LightYellow,
            "light_blue" => Color::LightBlue,
            "light_magenta" => Color::LightMagenta,
            "light_cyan" => Color::LightCyan,
            "white" => Color::White,
            _ => Color::Reset,
        }
    }
}
