# Fuzzy Search Engine

The fuzzy search engine lives in `src/fuzzy/mod.rs`. It is intentionally self-contained — no external crates — and is optimised for the substring-heavy patterns typical in package names.

---

## Public API

```rust
/// Returns a score in [0.0, ∞). Returns 0.0 when there is no fuzzy match.
pub fn fuzzy_match(query: &str, target: &str) -> f64;

/// Returns the character indices in `target` that match `query` in order,
/// or `None` if no such sequence exists.
pub fn fuzzy_get_indexes(query: &[char], target: &[char]) -> Option<Vec<usize>>;

/// Computes the final score given the matched positions.
pub fn calculate_score(query: &[char], target: &[char], indices: &[usize]) -> f64;
```

---

## Matching Algorithm

`fuzzy_get_indexes` performs a greedy left-to-right scan: for each character in `query` it finds the first remaining position in `target` that matches (case-insensitively). If any query character cannot be matched, `None` is returned and the package is excluded from results.

---

## Scoring

`calculate_score` is inspired by the [VS Code fuzzy finder algorithm](https://github.com/microsoft/vscode/blob/main/src/vs/base/common/fuzzyScorer.ts). The score rewards:

| Condition | Bonus |
|-----------|-------|
| Every matched character | +1.0 |
| Consecutive run of matches | +1.0 + 0.3 × run length |
| Match at position 0 (start of name) | +4.0 |
| Match after a separator (`-`, `_`, `/`, `.`, ` `) | +2.5 |

And penalises gaps between matched characters:

| Condition | Penalty |
|-----------|---------|
| Gap of *n* characters between consecutive matches | −0.15 × n |

The raw score is then normalised by `target_length * 0.15 + 1.0` to prevent long package names from dominating.

---

## Integration

`fuzzy_match` is called from `parse_alternating_lines` in `src/managers/mod.rs` for every package returned by a backend. Packages with a score ≤ 0.01 are dropped, and the remainder are sorted descending by score before being sent to the UI.

Each backend's `search` method may also pass the query directly to the underlying tool (e.g. `pacman -Ss <query>`), so the fuzzy layer acts as a **re-ranking** step on top of the backend's own filtering, not a replacement for it.
