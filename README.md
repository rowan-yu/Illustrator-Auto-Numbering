# ClickLabel for Adobe Illustrator

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

## Installation

### Quick Install (Windows)

1. Download the latest release (`ClickLabel.zip`)
2. Extract the zip
3. **Right-click `Install.bat` → Run as administrator**
4. The installer will auto-detect your Illustrator version and language
5. Restart Illustrator — done!

```
ClickLabel/
├── Install.bat              ← Double-click to install
├── Uninstall.bat            ← Double-click to uninstall
├── README.md
├── LICENSE
├── scripts/
│   ├── ClickNumber_v2.jsx        (Chinese UI)
│   ├── ClickNumber_v2_EN.jsx     (English UI)
│   └── ClickLetter.jsx           (English UI)
└── hotkeys/
    ├── ClickNumber_Hotkey.ahk    (F2 shortcut)
    └── ClickLetter_Hotkey.ahk    (F3 shortcut)
```

The installer will:
- Auto-detect your Illustrator installation (2023 / 2024 / 2025)
- Auto-detect your language folder (Chinese / English)
- Copy scripts to the correct directory
- Update hotkey file paths automatically
- Optionally add hotkeys to Windows startup

### Manual Install

Copy the `.jsx` files from the `scripts/` folder to your Illustrator scripts folder:

**Windows:**
```
C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\zh_CN\脚本\
```

**macOS:**
```
/Applications/Adobe Illustrator 2025/Presets/zh_CN/脚本/
```

> For English versions, replace `zh_CN\脚本` with `en_US\Scripts`.

Restart Illustrator. Scripts appear under **File → Scripts**.

### Uninstall

Run `Uninstall.bat` — it removes all scripts and startup entries cleanly.

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
- **Persistent config** — Settings saved in the document, survive save/close/reopen
- **Reset anytime** — Run without selection to view status, change the current value, or reset

---

## Usage

### First Run — Configure

Run a script via **File → Scripts** (or press F2/F3). A setup dialog appears:

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

### Place Labels

1. Use the **Selection Tool (V)** to draw a small rectangle or circle where you want a label
2. Keep it selected
3. Press **F2** (number) or **F3** (letter)
4. The shape is replaced with the current label
5. Repeat — the value auto-increments

### Batch Mode

Select multiple shapes at once → Run the script → All shapes are replaced with sequential labels, ordered top-to-bottom, left-to-right.

---

## Shortcut Keys

Included `.ahk` scripts provide single-key shortcuts. Requires [AutoHotkey v2](https://www.autohotkey.com/) on Windows.

| Shortcut | Action |
|----------|--------|
| **F2** | Place next number |
| **F3** | Place next letter |

Shortcuts only activate inside the Illustrator window.

> The installer can optionally add hotkeys to Windows startup so they're always ready.

---

## How It Works

Each script stores its configuration (current value, prefix, suffix, etc.) in a hidden text frame placed far off the artboard (`-10000, -10000`). This means:

- Config persists when you save and reopen the document
- Each document has its own independent numbering/lettering
- ClickNumber and ClickLetter use separate configs — they don't interfere with each other
- Run a script with nothing selected to view/edit/reset its config

---

## Troubleshooting

**Install.bat says "could not detect Illustrator"**
→ Enter your install path manually when prompted (e.g. `C:\Program Files\Adobe\Adobe Illustrator 2025`).

**Script doesn't appear in File → Scripts**
→ Make sure the `.jsx` file is in the correct Presets folder and restart Illustrator.

**Numbers/letters start from the wrong value**
→ Run the script with nothing selected → Change the value in the status panel.

**Want to start over**
→ Run with nothing selected → Click "Reset All".

**F2/F3 not working**
→ Make sure AutoHotkey v2 is installed and the `.ahk` files are running (green H in system tray). Check that the script path inside the `.ahk` file is correct.

**Can I use both at the same time?**
→ Yes! They use separate configs. F2 for numbers and F3 for letters work independently.

---

## License

MIT — free to use, modify, and distribute.

---

## Contributing

Issues and pull requests are welcome. Ideas for future features:

- Roman numeral mode (I, II, III...)
- Circular badge backgrounds
- Custom font selection
- Arrow leaders / callout lines
- macOS installer script
