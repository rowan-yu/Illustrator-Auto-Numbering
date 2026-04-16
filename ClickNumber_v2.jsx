/*
  ClickNumber_v2.jsx - 自动递增编号（优化版）
  
  使用方法：
  方式A（推荐）：
  1. 第一次运行 → 设置编号参数
  2. 用【选择工具(V)】在画板上画一个小矩形/圆形作为定位点
  3. 选中它，运行脚本 → 自动在该位置生成编号文字
  4. 重复 2-3，编号自动+1
  
  方式B：
  1. 直接运行脚本（不选任何东西）
  2. 脚本自动在画板中心创建编号
  3. 你手动拖到想要的位置
  
  绑定快捷键：动作面板 → 新建动作 → 录制 → 运行此脚本 → 停止 → 设快捷键
*/

#target illustrator

(function () {
    if (!app.documents.length) {
        alert("请先打开一个文档！");
        return;
    }

    var doc = app.activeDocument;
    var configName = "_autoNumConfig_v2";
    var config = null;

    // ========== 读取配置 ==========
    for (var i = 0; i < doc.textFrames.length; i++) {
        if (doc.textFrames[i].name === configName) {
            try {
                config = eval("(" + doc.textFrames[i].contents + ")");
            } catch (e) {
                config = null;
            }
            break;
        }
    }

    // ========== 首次运行：弹出设置 ==========
    if (!config) {
        var dialog = new Window("dialog", "自动编号 - 初始设置");
        dialog.orientation = "column";
        dialog.alignChildren = ["fill", "top"];

        var g1 = dialog.add("group");
        g1.add("statictext", undefined, "起始编号：");
        var startInput = g1.add("edittext", undefined, "1");
        startInput.characters = 6;

        var g2 = dialog.add("group");
        g2.add("statictext", undefined, "前　　缀：");
        var prefixInput = g2.add("edittext", undefined, "");
        prefixInput.characters = 6;

        var g3 = dialog.add("group");
        g3.add("statictext", undefined, "后　　缀：");
        var suffixInput = g3.add("edittext", undefined, "");
        suffixInput.characters = 6;

        var g4 = dialog.add("group");
        g4.add("statictext", undefined, "字体大小：");
        var sizeInput = g4.add("edittext", undefined, "14");
        sizeInput.characters = 6;
        g4.add("statictext", undefined, "pt");

        var g5 = dialog.add("group");
        g5.add("statictext", undefined, "文字颜色：");
        var colorDrop = g5.add("dropdownlist", undefined, [
            "红色", "黑色", "白色", "蓝色"
        ]);
        colorDrop.selection = 0;

        var g6 = dialog.add("group");
        g6.add("statictext", undefined, "编号位数：");
        var digitDrop = g6.add("dropdownlist", undefined, [
            "自动 (1, 2, 3...)", 
            "两位 (01, 02, 03...)", 
            "三位 (001, 002, 003...)"
        ]);
        digitDrop.selection = 0;

        dialog.add("panel", undefined, "使用说明").add("statictext", undefined,
            "设置完成后：\n" +
            "1. 用选择工具(V)画个小形状定位\n" +
            "2. 选中它 → 运行脚本 → 自动标号\n" +
            "3. 也可以不选，直接运行放在画板中心\n" +
            "建议绑定快捷键（如F2）更方便",
            { multiline: true }
        ).preferredSize = [280, 90];

        var btnG = dialog.add("group");
        btnG.alignment = "center";
        btnG.add("button", undefined, "确定", { name: "ok" });
        btnG.add("button", undefined, "取消", { name: "cancel" });

        if (dialog.show() !== 1) return;

        config = {
            current: parseInt(startInput.text) || 1,
            prefix: prefixInput.text,
            suffix: suffixInput.text,
            fontSize: parseFloat(sizeInput.text) || 14,
            colorIndex: colorDrop.selection.index,
            digits: digitDrop.selection.index  // 0=auto, 1=2位, 2=3位
        };

        saveConfig(doc, configName, config);
        alert("设置完成！编号从 " + formatNum(config.current, config.digits) + " 开始。\n\n" +
              "现在画个小形状选中它，再运行脚本即可标号。");
        return;
    }

    // ========== 有配置：执行编号 ==========
    var posX, posY;
    var deleteTarget = false;

    // 判断选中状态
    if (doc.selection.length === 1) {
        var sel = doc.selection[0];
        
        if (sel.typename === "TextFrame" && sel.name === configName) {
            // 选中的是配置框，忽略
            showStatus(doc, configName, config);
            return;
        }
        
        if (sel.typename === "TextFrame") {
            // 选中的是已有文本框 → 直接替换内容
            replaceText(sel, config);
            config.current++;
            saveConfig(doc, configName, config);
            return;
        }
        
        // 选中的是形状 → 获取位置，创建编号，删除形状
        posX = sel.left + sel.width / 2;
        posY = sel.top - sel.height / 2;
        deleteTarget = true;
        
    } else if (doc.selection.length > 1) {
        // 多选 → 批量编号
        var items = [];
        for (var i = 0; i < doc.selection.length; i++) {
            items.push(doc.selection[i]);
        }
        // 按从左到右、从上到下排序
        items.sort(function (a, b) {
            var rowDiff = b.top - a.top; // 先按 Y（从上到下）
            if (Math.abs(rowDiff) > 20) return rowDiff > 0 ? -1 : 1;
            return a.left - b.left; // 再按 X（从左到右）
        });

        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            if (item.name === configName) continue;

            if (item.typename === "TextFrame") {
                replaceText(item, config);
            } else {
                var cx = item.left + item.width / 2;
                var cy = item.top - item.height / 2;
                createNumberAt(doc, cx, cy, config);
                item.remove();
            }
            config.current++;
        }
        saveConfig(doc, configName, config);
        return;
        
    } else {
        // 没选任何东西 → 显示状态面板
        showStatus(doc, configName, config);
        return;
    }

    // 在位置创建编号
    createNumberAt(doc, posX, posY, config);

    // 删除定位形状
    if (deleteTarget) {
        doc.selection[0].remove();
    }

    config.current++;
    saveConfig(doc, configName, config);


    // ==================== 工具函数 ====================

    function formatNum(num, digits) {
        var s = String(num);
        if (digits === 1) { while (s.length < 2) s = "0" + s; }
        if (digits === 2) { while (s.length < 3) s = "0" + s; }
        return s;
    }

    function getColor(index) {
        var c = new RGBColor();
        switch (index) {
            case 0: c.red = 255; c.green = 30; c.blue = 30; break;
            case 1: c.red = 0; c.green = 0; c.blue = 0; break;
            case 2: c.red = 255; c.green = 255; c.blue = 255; break;
            case 3: c.red = 0; c.green = 100; c.blue = 255; break;
        }
        return c;
    }

    function replaceText(textFrame, cfg) {
        var label = cfg.prefix + formatNum(cfg.current, cfg.digits) + cfg.suffix;
        textFrame.contents = label;
        var attrs = textFrame.textRange.characterAttributes;
        attrs.size = cfg.fontSize;
        attrs.fillColor = getColor(cfg.colorIndex);
        textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
    }

    function createNumberAt(doc, x, y, cfg) {
        var label = cfg.prefix + formatNum(cfg.current, cfg.digits) + cfg.suffix;
        var tf = doc.textFrames.add();
        tf.contents = label;
        tf.textRange.characterAttributes.size = cfg.fontSize;
        tf.textRange.characterAttributes.fillColor = getColor(cfg.colorIndex);
        tf.textRange.paragraphAttributes.justification = Justification.CENTER;
        // 居中放置
        tf.left = x - tf.width / 2;
        tf.top = y + tf.height / 2;
    }

    function saveConfig(doc, name, cfg) {
        var configFrame = null;
        for (var i = 0; i < doc.textFrames.length; i++) {
            if (doc.textFrames[i].name === name) {
                configFrame = doc.textFrames[i];
                break;
            }
        }
        if (!configFrame) {
            configFrame = doc.textFrames.add();
            configFrame.name = name;
            configFrame.left = -10000;
            configFrame.top = -10000;
        }
        configFrame.contents = "{current:" + cfg.current +
            ",prefix:'" + cfg.prefix +
            "',suffix:'" + cfg.suffix +
            "',fontSize:" + cfg.fontSize +
            ",colorIndex:" + cfg.colorIndex +
            ",digits:" + cfg.digits + "}";
        configFrame.textRange.characterAttributes.size = 1;
        var hideColor = new RGBColor();
        hideColor.red = 255; hideColor.green = 255; hideColor.blue = 255;
        configFrame.textRange.characterAttributes.fillColor = hideColor;
    }

    function showStatus(doc, configName, cfg) {
        var sd = new Window("dialog", "自动编号 - 当前状态");
        sd.orientation = "column";
        sd.alignChildren = ["fill", "top"];

        sd.add("statictext", undefined, "下一个编号：" + cfg.prefix + formatNum(cfg.current, cfg.digits) + cfg.suffix);
        sd.add("statictext", undefined, "字体：" + cfg.fontSize + "pt");

        var mg = sd.add("group");
        mg.add("statictext", undefined, "修改编号为：");
        var mi = mg.add("edittext", undefined, String(cfg.current));
        mi.characters = 6;

        sd.add("statictext", undefined, "——————————————————");
        sd.add("statictext", undefined, "提示：选中形状后运行 → 自动标号并删除形状", { multiline: true });

        var bg = sd.add("group");
        bg.alignment = "center";
        bg.add("button", undefined, "更新", { name: "ok" });
        var rb = bg.add("button", undefined, "重置全部");
        bg.add("button", undefined, "关闭", { name: "cancel" });

        rb.onClick = function () {
            for (var i = 0; i < doc.textFrames.length; i++) {
                if (doc.textFrames[i].name === configName) {
                    doc.textFrames[i].remove();
                    break;
                }
            }
            sd.close(2);
            alert("已重置！下次运行重新设置。");
        };

        if (sd.show() === 1) {
            cfg.current = parseInt(mi.text) || cfg.current;
            saveConfig(doc, configName, cfg);
        }
    }

})();
