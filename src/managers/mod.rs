pub mod apt;
pub mod arch;
pub mod brew;
pub mod pacman;
pub mod yay;

use ratatui::DefaultTerminal;
use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};

/// A single package entry returned by a [`PackageManager`].
///
/// This is the UI-friendly representation of a package, including:
/// - `provider`: which backend/manager produced the result (e.g. `pacman`, `yay`, `brew`).
/// - `name`: the package identifier as returned by the backend.
/// - `version`: the installed/upgradable version string.
/// - `description`: a human-readable summary.
/// - `score`: fuzzy-search score used for ranking (higher is better).
#[derive(Debug, Clone, PartialEq)]
pub struct Package {
    /// Backend/manager name that produced this package.
    pub provider: String,
    /// Package identifier/name.
    pub name: String,
    /// Version string (exact formatting depends on the backend).
    pub version: String,
    /// Human-readable description/summary.
    pub description: String,
    /// Fuzzy-search relevance score for the current query.
    pub score: f64,
}

/// Trait implemented by each package backend (pacman/yay/apt/brew, etc.).
///
/// Implementations are expected to:
/// - Be `Send` + `Sync` because calls may occur from worker threads.
/// - Return results in a UI-ready form (`Vec<Package>`, etc.).
/// - Surface backend failures via the returned `Err`.
pub trait PackageManager: Send + Sync {
    /// Name/identifier of this manager (used for matching and display).
    fn name(&self) -> &str;

    /// Search packages matching `query`.
    ///
    /// Returns a list of packages sorted/ranked for fuzzy matching.
    fn search(&self, query: &str) -> Vec<Package>;

    /// Return the set of installed package names.
    fn get_installed(&self) -> HashSet<String>;

    /// Return detailed entries for all installed packages.
    fn get_installed_details(&self) -> Vec<Package>;

    /// Return packages that have updates available.
    fn get_updates(&self) -> Vec<Package>;

    /// Fetch extra key/value details for `pkg`.
    ///
    /// `provider` is the manager identifier associated with the package (typically taken from
    /// `Package::provider`).
    ///
    /// Returns `Some(details)` if the manager can resolve the package; otherwise `None`.
    fn get_details(&self, pkg: &str, provider: &str) -> Option<HashMap<String, String>>;

    /// Install the selected set of packages.
    ///
    /// # Errors
    /// Returns `Err` if the underlying command fails.
    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;

    /// Remove the selected set of packages.
    ///
    /// # Errors
    /// Returns `Err` if the underlying command fails.
    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;

    /// Upgrade the selected set of packages.
    ///
    /// # Errors
    /// Returns `Err` if the underlying command fails.
    fn update_packages(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>>;

    /// Perform a full system upgrade for this manager.
    ///
    /// # Errors
    /// Returns `Err` if the underlying command fails.
    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;

    /// Refresh this manager's package databases (make sure search/update data is current).
    ///
    /// # Errors
    /// Returns `Err` if refreshing fails.
    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>>;
}

/// A `PackageManager` implementation that delegates to multiple backends.
///
/// Used when more than one enabled manager is available (e.g. `pacman/yay` + `apt`).
///
/// For read-only operations (search/installed/updates), it aggregates results across all
/// contained managers. For operations that mutate the system (install/remove/update/upgrade),
/// it currently forwards the request to each contained manager.
pub struct CombinedManager {
    managers: Vec<Box<dyn PackageManager>>,
}

impl PackageManager for CombinedManager {
    fn name(&self) -> &str {
        "Multiple Managers"
    }

    fn search(&self, query: &str) -> Vec<Package> {
        let mut all = Vec::new();
        for m in &self.managers {
            all.extend(m.search(query));
        }
        all.sort_by(|a, b| {
            b.score
                .partial_cmp(&a.score)
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        all
    }

    fn get_installed(&self) -> HashSet<String> {
        let mut all = HashSet::new();
        for m in &self.managers {
            all.extend(m.get_installed());
        }
        all
    }

    fn get_installed_details(&self) -> Vec<Package> {
        let mut all = Vec::new();
        for m in &self.managers {
            all.extend(m.get_installed_details());
        }
        all
    }

    fn get_updates(&self) -> Vec<Package> {
        let mut all = Vec::new();
        for m in &self.managers {
            all.extend(m.get_updates());
        }
        all
    }

    fn get_details(&self, pkg: &str, provider: &str) -> Option<HashMap<String, String>> {
        for m in &self.managers {
            // Check if this manager's name/prefix matches the provider
            if provider.to_lowercase().contains(&m.name().to_lowercase())
                || m.name().to_lowercase().contains(&provider.to_lowercase())
            {
                return m.get_details(pkg, provider);
            }
        }
        // Fallback: try all
        for m in &self.managers {
            if let Some(details) = m.get_details(pkg, provider) {
                return Some(details);
            }
        }
        None
    }

    fn install(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        for m in &self.managers {
            // This is tricky; we'd need to know which package belongs to which manager.
            // For now, let's assume the manager's internal logic handles its own packages.
            m.install(terminal, pkgs)?;
        }
        Ok(())
    }

    fn remove(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        for m in &self.managers {
            m.remove(terminal, pkgs)?;
        }
        Ok(())
    }

    fn update_packages(
        &self,
        terminal: &mut DefaultTerminal,
        pkgs: &HashSet<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // Partition `pkgs` by manager: only send a package to the backend that
        // owns it (determined by intersecting with each manager's installed set).
        // This prevents backends from attempting to upgrade packages they don't manage.
        for m in &self.managers {
            let installed = m.get_installed();
            let manager_pkgs: HashSet<String> = pkgs
                .iter()
                .filter(|p| installed.contains(*p))
                .cloned()
                .collect();
            if !manager_pkgs.is_empty() {
                m.update_packages(terminal, &manager_pkgs)?;
            }
        }
        Ok(())
    }

    fn system_upgrade(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        for m in &self.managers {
            m.system_upgrade(terminal)?;
        }
        Ok(())
    }

    fn refresh_databases(
        &self,
        terminal: &mut DefaultTerminal,
    ) -> Result<(), Box<dyn std::error::Error>> {
        for m in &self.managers {
            m.refresh_databases(terminal)?;
        }
        Ok(())
    }
}

/// Detect which package managers are likely available on the system.
///
/// This probes the presence of external commands (e.g. `pacman`, `brew`, `apt`) by attempting to
/// run `--version`.
///
/// Returns a list of manager identifiers that were detected. The list may be empty if none are
/// found.
pub fn get_available_managers() -> Vec<String> {
    let mut available = Vec::new();

    if std::process::Command::new("pacman")
        .arg("--version")
        .output()
        .is_ok()
    {
        available.push("pacman".to_string());
        available.push("yay".to_string());
    }

    if std::process::Command::new("brew")
        .arg("--version")
        .output()
        .is_ok()
    {
        available.push("brew".to_string());
    }

    if std::process::Command::new("apt")
        .arg("--version")
        .output()
        .is_ok()
    {
        available.push("apt".to_string());
    }

    available
}

/// Construct the appropriate `PackageManager` implementation for the current configuration.
///
/// The selection logic:
/// - Uses `enabled_managers` from `config.settings` to decide which backends may be used.
/// - Uses `get_available_managers()` and command detection to decide which backends actually
///   exist on this system.
/// - Returns:
///   - a single backend when exactly one enabled manager is available,
///   - a `CombinedManager` when multiple enabled managers are available,
///   - a fallback backend when no explicit enabled managers are found.
pub fn get_system_manager(config: &crate::config::Config) -> Box<dyn PackageManager> {
    let mut managers: Vec<Box<dyn PackageManager>> = Vec::new();
    let enabled = &config.settings.enabled_managers;
    let available = get_available_managers();

    if available.contains(&"brew".to_string()) && enabled.contains(&"brew".to_string()) {
        managers.push(Box::new(brew::BrewManager));
    }

    if (available.contains(&"pacman".to_string()) || available.contains(&"yay".to_string()))
        && (enabled.contains(&"pacman".to_string()) || enabled.contains(&"yay".to_string()))
    {
        managers.push(Box::new(arch::ArchManager::new(config.aur_helper.clone())));
    }

    if available.contains(&"apt".to_string()) && enabled.contains(&"apt".to_string()) {
        managers.push(Box::new(apt::AptManager));
    }

    if managers.is_empty() {
        if available.contains(&"pacman".to_string()) {
            return Box::new(arch::ArchManager::new(config.aur_helper.clone()));
        }
        return Box::new(apt::AptManager);
    }

    if managers.len() == 1 {
        return managers.pop().unwrap();
    }

    Box::new(CombinedManager { managers })
}

/// A global cache for package details.
///
/// The outer key is the package name; the inner map stores backend-provided key/value detail
/// strings.
lazy_static::lazy_static! {
    /// Cached details results (thread-safe via `Arc<Mutex<_>>`).
    pub static ref DETAILS_CACHE: Arc<Mutex<HashMap<String, HashMap<String, String>>>> =
        Arc::new(Mutex::new(HashMap::new()));

    /// Cached search results (thread-safe via `Arc<Mutex<_>>`).
    pub static ref SEARCH_CACHE: Arc<Mutex<HashMap<String, Vec<Package>>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

/// Parse CLI output in an *alternating lines* format into `Package` entries.
///
/// Many backends emit two-line blocks where:
/// - the **first** line contains: `name version` (whitespace separated; at least 2 tokens),
/// - the **second** line contains a description.
///
/// For each block, this function:
/// - derives `provider` from `manager`,
/// - extracts `name` and `version`,
/// - derives a fuzzy-search target from the last path segment (`pkg.split('/').last()`),
/// - computes `score` via [`crate::fuzzy::fuzzy_match`].
///
/// Entries with very low scores (`<= 0.01`) are filtered out.
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
