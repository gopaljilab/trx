# UI & Rendering

TRX's TUI is built on [ratatui](https://ratatui.rs/), a Rust library for building terminal UIs with a retained-mode, declarative rendering model.

---

## Layout

`draw_ui` in `src/ui/draw.rs` computes the full layout on every frame:

```
┌─────────────────────────────────────────┐
│ Help header  (1 line)                   │
├─────────────────────────────────────────┤
│ Tab bar      (3 lines)                  │
├───────────────────────┬─────────────────┤
│                       │                 │
│  Package list         │  Details panel  │
│  + search input       │                 │
│  (Search tab only)    │                 │
│                       │                 │
├─────────────────────────────────────────┤
│ Status bar   (1 line)                   │
└─────────────────────────────────────────┘
```

The split between the list and details panel is **responsive**:
- Terminal width ≥ 100 columns → 50 / 50 horizontal split
- Terminal width < 100 columns → 60 / 40 split (still horizontal but tighter)

---

## Input Modes

`InputMode` in `src/ui/input.rs` is a simple two-variant enum:

```rust
pub enum InputMode {
    Normal,
    Editing,
}
```

- **Normal** — navigation, package operations, tab switching.
- **Editing** — the search input bar is focused; characters are routed to `App::enter_char` / `App::delete_char`.

The cursor is hidden in Normal mode and shown at the current character position in Editing mode.

---

## Spinner

While a background search or list-load is in progress, `App::loading` is `true`. The draw layer reads `App::spinner_tick` (incremented each frame) to index into a Braille spinner sequence:

```rust
const SPINNERS: [&str; 10] = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
```

---

## Help Overlay

Pressing `?` sets `App::show_help = true`. `draw_ui` renders a centred popup over the main content using the `centered_rect` helper, which computes a rectangle as a percentage of the terminal area. The overlay is cleared with the ratatui `Clear` widget before drawing the help text on top.

---

## Performance

- **Minimal redraws** — the event loop uses a short poll timeout (not a busy-wait), so frames are only rendered when there is user input or a channel message.
- **No double-buffer diffing overhead** — ratatui handles diffing internally; TRX simply calls `terminal.draw(|frame| draw_ui(frame, app))` each iteration.
- **Pure functions in draw layer** — `draw_ui` and its helpers take `&mut App` (for `ListState` selection) but do not mutate business logic, keeping rendering predictable and testable.
