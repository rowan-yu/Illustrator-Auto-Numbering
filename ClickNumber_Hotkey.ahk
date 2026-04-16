/*
  ClickNumber_Hotkey.ahk - 按 F2 在 Illustrator 中运行编号脚本
  
  使用方法：
  1. 安装 AutoHotkey v2：https://www.autohotkey.com/
  2. 双击运行本文件（托盘出现绿色H图标即运行中）
  3. 在 Illustrator 中按 F2 → 自动运行编号脚本
  4. 不想用了：右键托盘H图标 → Exit
  
  如果要开机自启：Win+R 输入 shell:startup 回车，
  把本文件的快捷方式放进去即可。
*/

#Requires AutoHotkey v2.0
#SingleInstance Force

; ★★★ 修改这里为你的脚本实际路径 ★★★
ScriptPath := "C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\zh_CN\脚本\ClickNumber_v2.jsx"

; 只在 Illustrator 窗口中生效
#HotIf WinActive("ahk_exe Illustrator.exe")

F2::
{
    global ScriptPath
    
    try {
        ; 通过 COM 调用 Illustrator 执行脚本
        aiApp := ComObject("Illustrator.Application")
        aiApp.DoJavaScriptFile(ScriptPath)
    } catch as err {
        MsgBox("运行失败：" . err.Message . "`n`n请确认：`n1. Illustrator 已打开`n2. 脚本路径正确", "错误")
    }
}

#HotIf

; 提示已启动
TrayTip("按 F2 标编号（仅在AI窗口中生效）", "ClickNumber 快捷键已启动", 1)
