/*
  ClickLetter_Hotkey.ahk - Press F3 to run ClickLetter in Illustrator
  
  How to use:
  1. Install AutoHotkey v2: https://www.autohotkey.com/
  2. Double-click this file (green H icon appears in system tray)
  3. Switch to Illustrator, press F3 to place a letter
  4. Right-click tray icon → Exit to quit
  
  To auto-start on boot: Win+R → shell:startup → put a shortcut here
*/

#Requires AutoHotkey v2.0
#SingleInstance Force

; ★★★ Edit this path to match your script location ★★★
ScriptPath := "C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\zh_CN\脚本\ClickLetter.jsx"

; Only active inside Illustrator
#HotIf WinActive("ahk_exe Illustrator.exe")

F3::
{
    global ScriptPath
    
    try {
        aiApp := ComObject("Illustrator.Application")
        aiApp.DoJavaScriptFile(ScriptPath)
    } catch as err {
        MsgBox("Failed: " . err.Message . "`n`nPlease check:`n1. Illustrator is open`n2. Script path is correct", "Error")
    }
}

#HotIf

TrayTip("Press F3 to place a letter (only in Illustrator)", "ClickLetter Hotkey Active", 1)
