# Illustrator-Auto-Numbering
Place auto-incrementing numbers anywhere on your Illustrator artboard with one click.
# ClickNumber for Adobe Illustrator

**Auto-increment numbering tool for Adobe Illustrator** — Draw a shape, run the script, get a number. Repeat. Numbers auto-increment.

![Illustrator](https://img.shields.io/badge/Adobe%20Illustrator-2024--2025-FF9A00?logo=adobeillustrator&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey)

---

## The Problem

Illustrator has no built-in "click to place sequential numbers" feature. Manually typing 1, 2, 3... on a complex diagram is tedious and error-prone.

## The Solution

**ClickNumber** lets you place auto-incrementing numbers anywhere on your artboard. Draw a shape as a position marker, select it, run the script — the shape is replaced with the next number. That's it.

---

## Features

- **Auto-increment** — Numbers increase automatically, no manual input needed
- **Batch numbering** — Select multiple shapes at once, all get numbered in order (top-to-bottom, left-to-right)
- **Customizable** — Set prefix, suffix, font size, color, and zero-padding (1 / 01 / 001)
- **Persistent config** — Settings are saved in the document, survive save/close/reopen
- **Reset anytime** — Run without selection to view status, change the current number, or reset

---

## Quick Start

### 1. Install the Script

Copy `ClickNumber_v2.jsx` (or `ClickNumber_v2_EN.jsx` for English) to your Illustrator scripts folder:

**Windows:**
```
C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\zh_CN\脚本\
```

**macOS:**
```
/Applications/Adobe Illustrator 2025/Presets/zh_CN/脚本/
```

> For English versions of Illustrator, replace `zh_CN\脚本` with `en_US\Scripts`.

Restart Illustrator. The script appears under **File → Scripts**.

### 2. First Run — Configure

Run the script via **File → Scripts → ClickNumber_v2**. A setup dialog appears:

| Setting | Description |
|---------|-------------|
| Start Number | First number in the sequence |
| Prefix | Text before the number (e.g. `#`) |
| Suffix | Text after the number (e.g. `.`) |
| Font Size | In points |
| Text Color | Red / Black / White / Blue |
| Digit Padding | Auto, 2-digit (01), or 3-digit (001) |

### 3. Place Numbers

1. Use the **Selection Tool (V)** to draw a small rectangle or circle where you want a number
2. Keep it selected
3. Run the script (or press your shortcut key)
4. The shape is replaced with the current number
5. Repeat — the number auto-increments

### 4. Batch Mode

Select multiple shapes at once → Run the script → All shapes are replaced with sequential numbers, ordered top-to-bottom, left-to-right.

---

## Bind a Shortcut Key (Recommended)

Running the script from the menu every time is slow. Here are two ways to speed it up:

### Option A: Illustrator Keyboard Shortcuts

**Edit → Keyboard Shortcuts → Menu Commands → File → Scripts → ClickNumber_v2** → Assign a key (e.g. `Ctrl+Shift+N`).

### Option B: AutoHotkey (Windows)

If your Illustrator version doesn't support script shortcuts, use the included `ClickNumber_Hotkey.ahk`:

1. Install [AutoHotkey v2](https://www.autohotkey.com/)
2. Edit the `.ahk` file to verify the script path
3. Double-click to run — press **F2** in Illustrator to place a number

The hotkey only activates inside Illustrator and won't interfere with other apps.

---

## Files

| File | Description |
|------|-------------|
| `ClickNumber_v2.jsx` | Main script (Chinese UI) |
| `ClickNumber_v2_EN.jsx` | Main script (English UI) |
| `ClickNumber_Hotkey.ahk` | AutoHotkey shortcut script (Windows) |
| `AutoNumber.jsx` | Legacy version with coordinate input |

---

## How It Works

The script stores its configuration (current number, prefix, suffix, etc.) in a hidden text frame placed far off the artboard (`-10000, -10000`). This means:

- Config persists when you save and reopen the document
- Each document has its own independent numbering
- Run the script with nothing selected to view/edit/reset the config

---

## Troubleshooting

**Script doesn't appear in File → Scripts**
→ Make sure the `.jsx` file is in the correct Presets folder and restart Illustrator.

**Numbers start from the wrong value**
→ Run the script with nothing selected → Change the number in the status panel.

**Want to start over**
→ Run with nothing selected → Click "Reset All".

**AutoHotkey script shows error**
→ Check that the `ScriptPath` in the `.ahk` file matches your actual Illustrator install path.

---

## License

MIT — free to use, modify, and distribute.

---

## Contributing

Issues and pull requests are welcome. If you have ideas for new features (e.g. circular badge backgrounds, custom fonts, arrow leaders), feel free to open an issue.
