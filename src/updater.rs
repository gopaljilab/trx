use serde::Deserialize;
use std::env;
use std::fs;

const GITHUB_API_URL: &str = "https://api.github.com/repos/pie-314/trx/releases/latest";
const USER_AGENT: &str = "trx-updater";

#[derive(Deserialize, Debug)]
struct Release {
    tag_name: String,
    assets: Vec<Asset>,
}

#[derive(Deserialize, Debug)]
struct Asset {
    name: String,
    browser_download_url: String,
}

pub fn check_for_updates() -> Option<(String, String)> {
    let client = reqwest::blocking::Client::builder()
        .user_agent(USER_AGENT)
        .timeout(std::time::Duration::from_secs(2))
        .build()
        .ok()?;

    let response = client.get(GITHUB_API_URL).send().ok()?;
    let release: Release = response.json().ok()?;

    let current_version = env!("CARGO_PKG_VERSION");
    let latest_version = release.tag_name.trim_start_matches('v');

    if is_newer(latest_version, current_version) {
        // Find asset for current platform
        let target_asset_name = match (env::consts::OS, env::consts::ARCH) {
            ("linux", "x86_64") => "trx-linux-x86_64.tar.gz",
            ("macos", "x86_64") => "trx-macos-x86_64.tar.gz",
            ("macos", "aarch64") => "trx-macos-aarch64.tar.gz",
            _ => return None,
        };

        let asset = release
            .assets
            .iter()
            .find(|a| a.name == target_asset_name)?;
        Some((
            latest_version.to_string(),
            asset.browser_download_url.clone(),
        ))
    } else {
        None
    }
}

fn is_newer(latest: &str, current: &str) -> bool {
    let latest_parts: Vec<u32> = latest.split('.').filter_map(|s| s.parse().ok()).collect();
    let current_parts: Vec<u32> = current.split('.').filter_map(|s| s.parse().ok()).collect();

    for (l, c) in latest_parts.iter().zip(current_parts.iter()) {
        if l > c {
            return true;
        }
        if l < c {
            return false;
        }
    }
    latest_parts.len() > current_parts.len()
}

pub fn update_self(url: &str) -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::blocking::Client::builder()
        .user_agent(USER_AGENT)
        .build()?;

    let response = client.get(url).send()?;
    let bytes = response.bytes()?;

    let current_exe = env::current_exe()?;
    let backup = current_exe.with_extension("old");

    // Extract binary from tar.gz
    let tar_gz = flate2::read::GzDecoder::new(&bytes[..]);
    let mut archive = tar::Archive::new(tar_gz);

    let mut new_binary_content = Vec::new();
    for entry in archive.entries()? {
        let mut entry = entry?;
        let path = entry.path()?;
        if path.to_str() == Some("trx") || path.to_str() == Some("trx.exe") {
            use std::io::Read;
            entry.read_to_end(&mut new_binary_content)?;
            break;
        }
    }

    if new_binary_content.is_empty() {
        return Err("Could not find binary in release archive".into());
    }

    // Rename current to backup
    fs::rename(&current_exe, &backup)?;

    // Write new binary
    fs::write(&current_exe, new_binary_content)?;

    // Make executable
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&current_exe)?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&current_exe, perms)?;
    }

    println!("Update successful! Please restart trx.");

    Ok(())
}
