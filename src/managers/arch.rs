use super::{pacman, yay};
use crate::managers::{Package, PackageManager};
use ratatui::DefaultTerminal;
use std::collections::{HashMap, HashSet};

pub struct ArchManager {
    pub aur_helper: String,
}

impl ArchManager {
    pub fn new(aur_helper: String) -> Self {
        Self { aur_helper }
    }
}

impl PackageManager for ArchManager {
    fn name(&self) -> &str {
        "Arch Linux (pacman/yay)"
    }

    fn search(&self, query: &str) -> Vec<Package> {
        let mut all = pacman::search_pacman(query);
        all.extend(yay::search_aur(query, &self.aur_helper));
        all.sort_by(|a, b| {
            b.score
                .partial_cmp(&a.score)
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        all.truncate(50);
        all
    }

    fn get_installed(&self) -> HashSet<String> {
        pacman::get_installed_packages()
    }

    fn get_installed_details(&self) -> Vec<Package> {
        pacman::get_installed_packages_details()
    }

    fn get_updates(&self) -> Vec<Package> {
        pacman::get_updates()
    }

    fn get_details(&self, pkg: &str, provider: &str) -> Option<HashMap<String, String>> {
        // Check cache first
        {
            let cache = crate::managers::DETAILS_CACHE.lock().unwrap();
            if let Some(cached) = cache.get(pkg) {
                return Some(cached.clone());
            }
        }

        let pure_name = pkg.split('/').last().unwrap_or(pkg);
        let provide = provider.split('/').next().unwrap_or(provider);

        let info = match provide {
            "aur" => yay::aur_details(pure_name)?,
            "pacman" => pacman::pacman_info(pure_name)?,
            _ => return None,
        };

        // Update cache
        {
            let mut cache = crate::managers::DETAILS_CACHE.lock().unwrap();
            cache.insert(pkg.to_string(), info.clone());
        }

        Some(info)
    }

    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut pacman_pkgs = HashSet::new();
        let mut aur_pkgs = HashSet::new();

        for name in pkgs {
            // Check provider prefix if possible, or just try to find in current list
            // For simplicity in the trait, we might need a better way to distinguish,
            // but for ArchManager we can check if it's in official repos first or has aur/ prefix
            if name.starts_with("aur/") {
                aur_pkgs.insert(name.clone());
            } else {
                pacman_pkgs.insert(name.clone());
            }
        }

        if !pacman_pkgs.is_empty() {
            pacman::pacman_install(terminal, &pacman_pkgs)?;
        }
        if !aur_pkgs.is_empty() {
            yay::aur_install(terminal, &aur_pkgs, &self.aur_helper)?;
        }
        Ok(())
    }

    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        pacman::pacman_remove(terminal, pkgs)
    }

    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        pacman::system_upgrade(terminal)?;
        yay::aur_upgrade(terminal, &self.aur_helper)?;
        Ok(())
    }

    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        pacman::refresh_databases(terminal)
    }
}
