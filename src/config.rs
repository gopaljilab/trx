use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub aur_helper: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            aur_helper: "yay".to_string(),
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
}
