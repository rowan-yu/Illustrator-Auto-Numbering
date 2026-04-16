/*
  ClickLetter.jsx - Auto Increment Letter Labeling (A-Z, AA-AZ...)
  
  How to use:
  Method A (Recommended):
  1. Run for the first time → Set parameters
  2. Use the Selection Tool (V) to draw a small rectangle/circle as a position marker
  3. Select it, run the script → A letter is automatically created at that position
  4. Repeat 2-3, letters auto increment (A, B, C... Z, AA, AB...)
  
  Method B:
  1. Run the script without selecting anything
  2. View status, change current letter, or reset
  
  Supports: A-Z, then AA, AB... AZ, BA, BB... ZZ
*/

#target illustrator

(function () {
    if (!app.documents.length) {
        alert("Please open a document first!");
        return;
    }

    var doc = app.activeDocument;
    var configName = "_autoLetterConfig";
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
        var dialog = new Window("dialog", "Auto Lettering - Setup");
        dialog.orientation = "column";
        dialog.alignChildren = ["fill", "top"];

        var g1 = dialog.add("group");
        g1.add("statictext", undefined, "Start Letter:");
        var startInput = g1.add("edittext", undefined, "A");
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
        g6.add("statictext", undefined, "Case:");
        var caseDrop = g6.add("dropdownlist", undefined, [
            "Uppercase (A, B, C...)",
            "Lowercase (a, b, c...)"
        ]);
        caseDrop.selection = 0;

        dialog.add("panel", undefined, "Instructions").add("statictext", undefined,
            "After setup:\n" +
            "1. Draw a small shape with Selection Tool (V)\n" +
            "2. Select it > Run script > Auto labeled\n" +
            "3. Sequence: A-Z, then AA, AB... AZ, BA...\n" +
            "Tip: Bind a shortcut key (e.g. F3) for speed",
            { multiline: true }
        ).preferredSize = [280, 90];

        var btnG = dialog.add("group");
        btnG.alignment = "center";
        btnG.add("button", undefined, "OK", { name: "ok" });
        btnG.add("button", undefined, "Cancel", { name: "cancel" });

        if (dialog.show() !== 1) return;

        var startLetter = startInput.text.toUpperCase();
        var startIndex = letterToIndex(startLetter);
        if (startIndex < 0) startIndex = 0;

        config = {
            current: startIndex,
            prefix: prefixInput.text,
            suffix: suffixInput.text,
            fontSize: parseFloat(sizeInput.text) || 14,
            colorIndex: colorDrop.selection.index,
            lowercase: caseDrop.selection.index  // 0=upper, 1=lower
        };

        saveConfig(doc, configName, config);
        alert("Setup complete! Lettering starts from " + getLetter(config.current, config.lowercase) + ".\n\n" +
              "Now draw a small shape, select it, and run the script to place a letter.");
        return;
    }

    // ========== Has Config: Execute Lettering ==========
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
                createLetterAt(doc, cx, cy, config);
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

    createLetterAt(doc, posX, posY, config);

    if (deleteTarget) {
        doc.selection[0].remove();
    }

    config.current++;
    saveConfig(doc, configName, config);


    // ==================== Utility Functions ====================

    // Index to letter: 0=A, 25=Z, 26=AA, 27=AB... 701=ZZ
    function indexToLetter(index) {
        var result = "";
        if (index < 26) {
            result = String.fromCharCode(65 + index);
        } else {
            var first = Math.floor((index - 26) / 26);
            var second = (index - 26) % 26;
            result = String.fromCharCode(65 + first) + String.fromCharCode(65 + second);
        }
        return result;
    }

    // Letter to index: A=0, Z=25, AA=26, AB=27...
    function letterToIndex(str) {
        str = str.toUpperCase();
        if (str.length === 1) {
            return str.charCodeAt(0) - 65;
        } else if (str.length === 2) {
            var first = str.charCodeAt(0) - 65;
            var second = str.charCodeAt(1) - 65;
            return 26 + first * 26 + second;
        }
        return 0;
    }

    function getLetter(index, lowercase) {
        var letter = indexToLetter(index);
        if (lowercase === 1) letter = letter.toLowerCase();
        return letter;
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
        var label = cfg.prefix + getLetter(cfg.current, cfg.lowercase) + cfg.suffix;
        textFrame.contents = label;
        var attrs = textFrame.textRange.characterAttributes;
        attrs.size = cfg.fontSize;
        attrs.fillColor = getColor(cfg.colorIndex);
        textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
    }

    function createLetterAt(doc, x, y, cfg) {
        var label = cfg.prefix + getLetter(cfg.current, cfg.lowercase) + cfg.suffix;
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
            ",lowercase:" + cfg.lowercase + "}";
        configFrame.textRange.characterAttributes.size = 1;
        var hideColor = new RGBColor();
        hideColor.red = 255; hideColor.green = 255; hideColor.blue = 255;
        configFrame.textRange.characterAttributes.fillColor = hideColor;
    }

    function showStatus(doc, configName, cfg) {
        var sd = new Window("dialog", "Auto Lettering - Status");
        sd.orientation = "column";
        sd.alignChildren = ["fill", "top"];

        sd.add("statictext", undefined, "Next Letter: " + cfg.prefix + getLetter(cfg.current, cfg.lowercase) + cfg.suffix);
        sd.add("statictext", undefined, "Font Size: " + cfg.fontSize + "pt");

        var mg = sd.add("group");
        mg.add("statictext", undefined, "Change to:");
        var mi = mg.add("edittext", undefined, getLetter(cfg.current, 0));
        mi.characters = 6;

        sd.add("statictext", undefined, "——————————————————");
        sd.add("statictext", undefined, "Enter a letter (A-Z or AA-ZZ) to change.\nSelect a shape then run to place a letter.", { multiline: true });

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
            var newIndex = letterToIndex(mi.text);
            if (newIndex >= 0) {
                cfg.current = newIndex;
                saveConfig(doc, configName, cfg);
            }
        }
    }

})();
