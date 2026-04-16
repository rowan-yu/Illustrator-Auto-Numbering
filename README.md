# ClickNumber & ClickLetter for Adobe Illustrator

**Auto-increment numbering & lettering tools for Adobe Illustrator** — Draw a shape, run the script, get a sequential number or letter. Repeat.

![Illustrator](https://img.shields.io/badge/Adobe%20Illustrator-2024--2025-FF9A00?logo=adobeillustrator&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey)

---

## The Problem

Illustrator has no built-in "click to place sequential numbers or letters" feature. Manually typing 1, 2, 3... or A, B, C... on complex architectural drawings is tedious and error-prone.

## The Solution

**ClickNumber** and **ClickLetter** let you place auto-incrementing labels anywhere on your artboard. Draw a shape as a position marker, select it, run the script — the shape is replaced with the next number or letter. That's it.

---

## Features

### ClickNumber
- **Auto-increment numbers** — 1, 2, 3... with no manual input
- **Zero-padding** — Choose auto, 2-digit (01, 02), or 3-digit (001, 002)
- **Customizable** — Prefix, suffix, font size, color

### ClickLetter
- **Auto-increment letters** — A, B, C... Z, then AA, AB... AZ, BA... ZZ
- **Case options** — Uppercase (A, B, C) or lowercase (a, b, c)
- **Customizable** — Prefix, suffix, font size, color

### Shared Features
- **Batch labeling** — Select multiple shapes at once, all get labeled in order (top-to-bottom, left-to-right)
- **Persistent config** — Settings are saved in the document, survive save/close/reopen
- **Reset anytime** — Run without selection to view status, change the current value, or reset

---

## Quick Start

### 1. Install the Scripts

Copy the `.jsx` files to your Illustrator scripts folder:

**Windows:**
```
C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\zh_CN\脚本\
```

**macOS:**
```
/Applications/Adobe Illustrator 2025/Presets/zh_CN/脚本/
```

> For English versions of Illustrator, replace `zh_CN\脚本` with `en_US\Scripts`.

Restart Illustrator. The scripts appear under **File → Scripts**.

### 2. First Run — Configure

Run a script via **File → Scripts**. A setup dialog appears:

**ClickNumber settings:**

| Setting | Description |
|---------|-------------|
| Start Number | First number in the sequence |
| Prefix / Suffix | Text before/after the number (e.g. `#`, `.`) |
| Font Size | In points |
| Text Color | Red / Black / White / Blue |
| Digit Padding | Auto, 2-digit (01), or 3-digit (001) |

**ClickLetter settings:**

| Setting | Description |
|---------|-------------|
| Start Letter | First letter in the sequence (e.g. A, D, AA) |
| Prefix / Suffix | Text before/after the letter |
| Font Size | In points |
| Text Color | Red / Black / White / Blue |
| Case | Uppercase (A, B, C) or Lowercase (a, b, c) |

### 3. Place Labels

1. Use the **Selection Tool (V)** to draw a small rectangle or circle where you want a label
2. Keep it selected
3. Run the script (or press your shortcut key)
4. The shape is replaced with the current number/letter
5. Repeat — the value auto-increments

### 4. Batch Mode

Select multiple shapes at once → Run the script → All shapes are replaced with sequential labels, ordered top-to-bottom, left-to-right.

---

## Shortcut Keys with AutoHotkey (Recommended)

Included `.ahk` scripts let you trigger numbering/lettering with a single key press. Requires [AutoHotkey v2](https://www.autohotkey.com/) on Windows.

| Shortcut | Action |
|----------|--------|
| **F2** | Place next number (ClickNumber) |
| **F3** | Place next letter (ClickLetter) |

### Setup

1. Install [AutoHotkey v2](https://www.autohotkey.com/)
2. Verify the script paths in each `.ahk` file match your Illustrator install location
3. Double-click both `.ahk` files to run (green H icons appear in system tray)
4. Switch to Illustrator — **F2** for numbers, **F3** for letters

Shortcuts only activate inside the Illustrator window and won't interfere with other apps.

**Auto-start on boot:** Press `Win+R`, type `shell:startup`, and place shortcuts to both `.ahk` files in the folder.

---

## Files

| File | Description |
|------|-------------|
| `ClickNumber_v2.jsx` | Number script (Chinese UI) |
| `ClickNumber_v2_EN.jsx` | Number script (English UI) |
| `ClickLetter.jsx` | Letter script (English UI) |
| `ClickNumber_Hotkey.ahk` | F2 shortcut for numbers (Windows) |
| `ClickLetter_Hotkey.ahk` | F3 shortcut for letters (Windows) |
| `AutoNumber.jsx` | Legacy version with coordinate input |

---

## How It Works

Each script stores its configuration (current value, prefix, suffix, etc.) in a hidden text frame placed far off the artboard (`-10000, -10000`). This means:

- Config persists when you save and reopen the document
- Each document has its own independent numbering/lettering
- ClickNumber and ClickLetter configs are independent — they don't interfere with each other
- Run a script with nothing selected to view/edit/reset its config

---

## Troubleshooting

**Script doesn't appear in File → Scripts**
→ Make sure the `.jsx` file is in the correct Presets folder and restart Illustrator.

**Numbers/letters start from the wrong value**
→ Run the script with nothing selected → Change the value in the status panel.

**Want to start over**
→ Run with nothing selected → Click "Reset All".

**AutoHotkey script shows error**
→ Check that the `ScriptPath` in the `.ahk` file matches your actual Illustrator install path.

**Both scripts running at the same time?**
→ Yes! They use separate configs. F2 for numbers and F3 for letters work independently.

---

## License

MIT — free to use, modify, and distribute.

---

## Contributing

Issues and pull requests are welcome. If you have ideas for new features (e.g. Roman numerals, circular badges, custom fonts, arrow leaders), feel free to open an issue.
