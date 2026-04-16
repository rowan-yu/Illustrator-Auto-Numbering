/*
  ClickNumber_v2.jsx - Auto Increment Numbering (English Version)
  
  How to use:
  Method A (Recommended):
  1. Run for the first time → Set numbering parameters
  2. Use the Selection Tool (V) to draw a small rectangle/circle as a position marker
  3. Select it, run the script → A number is automatically created at that position
  4. Repeat 2-3, numbers auto increment
  
  Method B:
  1. Run the script without selecting anything
  2. The script creates a number at the artboard center
  3. Manually drag it to your desired position
  
  Bind shortcut: Actions panel → New Action → Record → Run this script → Stop → Set shortcut key
*/

#target illustrator

(function () {
    if (!app.documents.length) {
        alert("Please open a document first!");
        return;
    }

    var doc = app.activeDocument;
    var configName = "_autoNumConfig_v2";
    var config = null;

    // ========== Load Config ==========
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

    // ========== First Run: Show Settings ==========
    if (!config) {
        var dialog = new Window("dialog", "Auto Numbering - Setup");
        dialog.orientation = "column";
        dialog.alignChildren = ["fill", "top"];

        var g1 = dialog.add("group");
        g1.add("statictext", undefined, "Start Number:");
        var startInput = g1.add("edittext", undefined, "1");
        startInput.characters = 6;

        var g2 = dialog.add("group");
        g2.add("statictext", undefined, "Prefix:");
        var prefixInput = g2.add("edittext", undefined, "");
        prefixInput.characters = 6;

        var g3 = dialog.add("group");
        g3.add("statictext", undefined, "Suffix:");
        var suffixInput = g3.add("edittext", undefined, "");
        suffixInput.characters = 6;

        var g4 = dialog.add("group");
        g4.add("statictext", undefined, "Font Size:");
        var sizeInput = g4.add("edittext", undefined, "14");
        sizeInput.characters = 6;
        g4.add("statictext", undefined, "pt");

        var g5 = dialog.add("group");
        g5.add("statictext", undefined, "Text Color:");
        var colorDrop = g5.add("dropdownlist", undefined, [
            "Red", "Black", "White", "Blue"
        ]);
        colorDrop.selection = 0;

        var g6 = dialog.add("group");
        g6.add("statictext", undefined, "Digit Padding:");
        var digitDrop = g6.add("dropdownlist", undefined, [
            "Auto (1, 2, 3...)", 
            "2 digits (01, 02, 03...)", 
            "3 digits (001, 002, 003...)"
        ]);
        digitDrop.selection = 0;

        dialog.add("panel", undefined, "Instructions").add("statictext", undefined,
            "After setup:\n" +
            "1. Draw a small shape with Selection Tool (V)\n" +
            "2. Select it > Run script > Auto numbered\n" +
            "3. Or run without selection to place at center\n" +
            "Tip: Bind a shortcut key (e.g. F2) for speed",
            { multiline: true }
        ).preferredSize = [280, 90];

        var btnG = dialog.add("group");
        btnG.alignment = "center";
        btnG.add("button", undefined, "OK", { name: "ok" });
        btnG.add("button", undefined, "Cancel", { name: "cancel" });

        if (dialog.show() !== 1) return;

        config = {
            current: parseInt(startInput.text) || 1,
            prefix: prefixInput.text,
            suffix: suffixInput.text,
            fontSize: parseFloat(sizeInput.text) || 14,
            colorIndex: colorDrop.selection.index,
            digits: digitDrop.selection.index
        };

        saveConfig(doc, configName, config);
        alert("Setup complete! Numbering starts from " + formatNum(config.current, config.digits) + ".\n\n" +
              "Now draw a small shape, select it, and run the script to place a number.");
        return;
    }

    // ========== Has Config: Execute Numbering ==========
    var posX, posY;
    var deleteTarget = false;

    if (doc.selection.length === 1) {
        var sel = doc.selection[0];
        
        if (sel.typename === "TextFrame" && sel.name === configName) {
            showStatus(doc, configName, config);
            return;
        }
        
        if (sel.typename === "TextFrame") {
            replaceText(sel, config);
            config.current++;
            saveConfig(doc, configName, config);
            return;
        }
        
        posX = sel.left + sel.width / 2;
        posY = sel.top - sel.height / 2;
        deleteTarget = true;
        
    } else if (doc.selection.length > 1) {
        var items = [];
        for (var i = 0; i < doc.selection.length; i++) {
            items.push(doc.selection[i]);
        }
        items.sort(function (a, b) {
            var rowDiff = b.top - a.top;
            if (Math.abs(rowDiff) > 20) return rowDiff > 0 ? -1 : 1;
            return a.left - b.left;
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
        showStatus(doc, configName, config);
        return;
    }

    createNumberAt(doc, posX, posY, config);

    if (deleteTarget) {
        doc.selection[0].remove();
    }

    config.current++;
    saveConfig(doc, configName, config);


    // ==================== Utility Functions ====================

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
        var sd = new Window("dialog", "Auto Numbering - Status");
        sd.orientation = "column";
        sd.alignChildren = ["fill", "top"];

        sd.add("statictext", undefined, "Next Number: " + cfg.prefix + formatNum(cfg.current, cfg.digits) + cfg.suffix);
        sd.add("statictext", undefined, "Font Size: " + cfg.fontSize + "pt");

        var mg = sd.add("group");
        mg.add("statictext", undefined, "Change to:");
        var mi = mg.add("edittext", undefined, String(cfg.current));
        mi.characters = 6;

        sd.add("statictext", undefined, "——————————————————");
        sd.add("statictext", undefined, "Tip: Select a shape then run > auto number and remove shape", { multiline: true });

        var bg = sd.add("group");
        bg.alignment = "center";
        bg.add("button", undefined, "Update", { name: "ok" });
        var rb = bg.add("button", undefined, "Reset All");
        bg.add("button", undefined, "Close", { name: "cancel" });

        rb.onClick = function () {
            for (var i = 0; i < doc.textFrames.length; i++) {
                if (doc.textFrames[i].name === configName) {
                    doc.textFrames[i].remove();
                    break;
                }
            }
            sd.close(2);
            alert("Reset complete! Settings will be reconfigured on next run.");
        };

        if (sd.show() === 1) {
            cfg.current = parseInt(mi.text) || cfg.current;
            saveConfig(doc, configName, cfg);
        }
    }

})();
