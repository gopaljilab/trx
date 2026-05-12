pub mod apt;
pub mod arch;
pub mod brew;
pub mod pacman;
pub mod yay;

use ratatui::DefaultTerminal;
use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone, PartialEq)]
pub struct Package {
    pub provider: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub score: f64,
}

pub trait PackageManager: Send + Sync {
    fn name(&self) -> &str;
    fn search(&self, query: &str) -> Vec<Package>;
    fn get_installed(&self) -> HashSet<String>;
    fn get_installed_details(&self) -> Vec<Package>;
    fn get_updates(&self) -> Vec<Package>;
    fn get_details(&self, pkg: &str, provider: &str) -> Option<HashMap<String, String>>;
    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;
    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;
    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;
    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;
}

pub fn get_system_manager(config: &crate::config::Config) -> Box<dyn PackageManager> {
    if std::env::consts::OS == "macos" {
        return Box::new(brew::BrewManager);
    }

    if std::process::Command::new("pacman")
        .arg("--version")
        .output()
        .is_ok()
    {
        return Box::new(arch::ArchManager::new(config.aur_helper.clone()));
    }

    if std::process::Command::new("apt")
        .arg("--version")
        .output()
        .is_ok()
    {
        return Box::new(apt::AptManager);
    }

    // Default or fallback
    Box::new(arch::ArchManager::new(config.aur_helper.clone()))
}

//makes a DETAILS_CACHE which is global
lazy_static::lazy_static! {
    pub static ref DETAILS_CACHE: Arc<Mutex<HashMap<String, HashMap<String, String>>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

pub fn parse_alternating_lines(lines: &[&str], manager: String, query: &str) -> Vec<Package> {
    let mut res = Vec::new();
    let mut i = 0;

    while i + 1 < lines.len() {
        let first_line = lines[i];
        let second_line = lines[i + 1];

        let parts: Vec<&str> = first_line.split_whitespace().collect();

        if parts.len() >= 2 {
            let package = parts[0].to_string();
            let version = parts[1].to_string();
            let description = second_line.trim().to_string();

            let package_name = package.split('/').last().unwrap_or(&package).to_string();
            let score = crate::fuzzy::fuzzy_match(query, &package_name);

            res.push(Package {
                provider: manager.clone(),
                name: package,
                version,
                description,
                score,
            });
        }

        i += 2;
    }

    res.retain(|p| p.score > 0.01);
    res.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    res
}
