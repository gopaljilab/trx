use crate::managers::{Package, PackageManager};
use ratatui::DefaultTerminal;
use std::collections::{HashMap, HashSet};
use std::process::Command;

pub struct BrewManager;

impl PackageManager for BrewManager {
    fn name(&self) -> &str {
        "Homebrew (macOS/Linux)"
    }

    fn search(&self, query: &str) -> Vec<Package> {
        if query.is_empty() {
            return Vec::new();
        }
        let output = Command::new("brew").args(&["search", query]).output().ok();

        if let Some(output) = output {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout
                .lines()
                .map(|line| {
                    let name = line.trim().to_string();
                    let score = crate::fuzzy::fuzzy_match(query, &name);
                    Package {
                        provider: "brew".to_string(),
                        name,
                        version: "".to_string(), // search doesn't give version
                        description: "".to_string(), // search doesn't give desc
                        score,
                    }
                })
                .filter(|p| p.score > 0.01)
                .collect()
        } else {
            Vec::new()
        }
    }

    fn get_installed(&self) -> HashSet<String> {
        let output = Command::new("brew")
            .args(&["list", "--formula"])
            .output()
            .ok();

        if let Some(output) = output {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout.lines().map(|s| s.trim().to_string()).collect()
        } else {
            HashSet::new()
        }
    }

    fn get_installed_details(&self) -> Vec<Package> {
        let output = Command::new("brew")
            .args(&["list", "--formula"])
            .output()
            .ok();

        if let Some(output) = output {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout
                .lines()
                .map(|line| Package {
                    provider: "brew".to_string(),
                    name: line.trim().to_string(),
                    version: "Installed".to_string(),
                    description: "".to_string(),
                    score: 1.0,
                })
                .collect()
        } else {
            Vec::new()
        }
    }

    fn get_updates(&self) -> Vec<Package> {
        let output = Command::new("brew").args(&["outdated"]).output().ok();

        if let Some(output) = output {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout
                .lines()
                .map(|line| Package {
                    provider: "brew".to_string(),
                    name: line.trim().to_string(),
                    version: "Outdated".to_string(),
                    description: "".to_string(),
                    score: 1.0,
                })
                .collect()
        } else {
            Vec::new()
        }
    }

    fn get_details(&self, pkg: &str, _provider: &str) -> Option<HashMap<String, String>> {
        // Check cache first
        {
            let cache = crate::managers::DETAILS_CACHE.lock().unwrap();
            if let Some(cached) = cache.get(pkg) {
                return Some(cached.clone());
            }
        }

        let output = Command::new("brew").args(&["info", pkg]).output().ok()?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        let mut out = HashMap::new();
        out.insert("Info".to_string(), stdout.to_string());

        // Update cache
        {
            let mut cache = crate::managers::DETAILS_CACHE.lock().unwrap();
            cache.insert(pkg.to_string(), out.clone());
        }

        Some(out)
    }

    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut args = vec!["install"];
        let pkg_refs: Vec<&str> = pkgs.iter().map(|s| s.as_str()).collect();
        args.extend(pkg_refs);
        crate::execute_external_command(terminal, "brew", &args)?;
        Ok(())
    }

    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut args = vec!["uninstall"];
        let pkg_refs: Vec<&str> = pkgs.iter().map(|s| s.as_str()).collect();
        args.extend(pkg_refs);
        crate::execute_external_command(terminal, "brew", &args)?;
        Ok(())
    }

    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        crate::execute_external_command(terminal, "brew", &["upgrade"])?;
        Ok(())
    }

    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        crate::execute_external_command(terminal, "brew", &["update"])?;
        Ok(())
    }
}
