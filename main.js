'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var config = {
    attributes: false,
    childList: true,
    subtree: false,
};
function tagNode(node) {
    if (node.nodeType === 3) {
        return;
    }
    var nodeEl = node;
    if (!nodeEl.dataset.tagName &&
        nodeEl.hasChildNodes() &&
        nodeEl.firstChild.nodeType !== 3) {
        var childEl = node.firstChild;
        nodeEl.dataset.tagName = childEl.tagName.toLowerCase();
    }
}
var CaliforniaCoastTheme = /** @class */ (function (_super) {
    __extends(CaliforniaCoastTheme, _super);
    function CaliforniaCoastTheme() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.media = null;
        _this.observers = {};
        _this.mediaCallback = function (e) {
            if (e.matches) {
                _this.updateDarkStyle();
            }
            else {
                _this.updateLightStyle();
            }
        };
        _this.listenForSystemTheme = function () {
            _this.media = window.matchMedia("(prefers-color-scheme: dark)");
            _this.media.addEventListener("change", _this.mediaCallback);
            _this.register(function () {
                return _this.media.removeEventListener("change", _this.mediaCallback);
            });
            if (_this.media.matches) {
                _this.updateDarkStyle();
            }
            else {
                _this.updateLightStyle();
            }
        };
        _this.stopListeningForSystemTheme = function () {
            _this.media.removeEventListener("change", _this.mediaCallback);
        };
        _this.enableContextualTypography = function () {
            _this.registerEvent(_this.app.workspace.on("layout-change", function () {
                var seen = {};
                _this.app.workspace.iterateRootLeaves(function (leaf) {
                    var id = leaf.id;
                    _this.connectObserver(id, leaf);
                    seen[id] = true;
                });
                Object.keys(_this.observers).forEach(function (k) {
                    if (!seen[k]) {
                        _this.disconnectObserver(k);
                    }
                });
            }));
        };
        _this.disableContextualTypography = function () {
            Object.keys(_this.observers).forEach(function (k) { return _this.disconnectObserver(k); });
        };
        return _this;
    }
    CaliforniaCoastTheme.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new ThemeSettings();
                        this.addSettingTab(new ThemeSettingTab(this.app, this));
                        this.addStyle();
                        this.refresh();
                        if (this.settings.useSystemTheme) {
                            this.enableSystemTheme();
                        }
                        if (!this.app.plugins.plugins["obsidian-contextual-typography"] &&
                            this.settings.prettyPreview) {
                            this.enableContextualTypography();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CaliforniaCoastTheme.prototype.onunload = function () {
        this.disableContextualTypography();
    };
    // refresh function for when we change settings
    CaliforniaCoastTheme.prototype.refresh = function () {
        // re-load the style
        this.updateStyle();
    };
    // add the styling elements we need
    CaliforniaCoastTheme.prototype.addStyle = function () {
        // add a css block for our settings-dependent styles
        var css = document.createElement("style");
        css.id = "california-coast-theme";
        document.getElementsByTagName("head")[0].appendChild(css);
        // add the main class
        document.body.classList.add("california-coast-theme");
        // update the style with the settings-dependent styles
        this.updateStyle();
    };
    CaliforniaCoastTheme.prototype.removeStyle = function () {
        document.body.removeClass("cc-pretty-editor", "cc-pretty-preview");
    };
    // update the styles (at the start, or as the result of a settings change)
    CaliforniaCoastTheme.prototype.updateStyle = function () {
        this.removeStyle();
        document.body.classList.toggle("cc-pretty-editor", this.settings.prettyEditor);
        document.body.classList.toggle("cc-pretty-preview", this.settings.prettyPreview);
        // get the custom css element
        var el = document.getElementById("california-coast-theme");
        if (!el)
            throw "california-coast-theme element not found!";
        else {
            // set the settings-dependent css
            el.innerText = ("\n        body.california-coast-theme {\n          --editor-font-size:" + this.settings.textNormal + "px;\n          --editor-font-features: " + this.settings.fontFeatures + ";\n          --line-width:" + this.settings.lineWidth + "rem;\n          --font-monospace:" + this.settings.monoFont + ";\n          --text:" + this.settings.textFont + ";\n          --text-editor:" + this.settings.editorFont + ";\n        }\n      ").trim().replace(/[\r\n\s]+/g, ' ');
        }
    };
    CaliforniaCoastTheme.prototype.enableSystemTheme = function () {
        this.app.workspace.layoutReady
            ? this.listenForSystemTheme()
            : this.app.workspace.on("layout-ready", this.listenForSystemTheme);
    };
    CaliforniaCoastTheme.prototype.updateDarkStyle = function () {
        document.body.removeClass("theme-light");
        document.body.addClass("theme-dark");
        this.app.workspace.trigger("css-change");
    };
    CaliforniaCoastTheme.prototype.updateLightStyle = function () {
        document.body.removeClass("theme-dark");
        document.body.addClass("theme-light");
        this.app.workspace.trigger("css-change");
    };
    CaliforniaCoastTheme.prototype.disconnectObserver = function (id) {
        if (this.observers[id]) {
            this.observers[id].disconnect();
            delete this.observers[id];
        }
    };
    CaliforniaCoastTheme.prototype.connectObserver = function (id, leaf) {
        if (this.observers[id])
            return;
        var previewSection = leaf.view.containerEl.getElementsByClassName("markdown-preview-section");
        if (previewSection.length) {
            this.observers[id] = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(tagNode);
                });
            });
            this.observers[id].observe(previewSection[0], config);
            setTimeout(function () {
                previewSection[0].childNodes.forEach(tagNode);
            }, 0);
        }
    };
    return CaliforniaCoastTheme;
}(obsidian.Plugin));
var ThemeSettings = /** @class */ (function () {
    function ThemeSettings() {
        this.prettyEditor = true;
        this.prettyPreview = true;
        this.useSystemTheme = false;
        this.lineWidth = 42;
        this.textNormal = 18;
        this.fontFeatures = '""';
        this.textFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.editorFont = '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
        this.monoFont = "Menlo,SFMono-Regular,Consolas,Roboto Mono,monospace";
    }
    return ThemeSettings;
}());
var ThemeSettingTab = /** @class */ (function (_super) {
    __extends(ThemeSettingTab, _super);
    function ThemeSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    ThemeSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl("h3", { text: "California Coast Theme" });
        new obsidian.Setting(containerEl)
            .setName("Enhanced Editor Typography")
            .setDesc("Enhances the typography styles in editor mode")
            .addToggle(function (toggle) {
            return toggle.setValue(_this.plugin.settings.prettyEditor).onChange(function (value) {
                _this.plugin.settings.prettyEditor = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Enhanced Preview Typography")
            .setDesc("Enhances the typography styles in preview mode. The Contextual Typography plugin is recommended")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.prettyPreview)
                .onChange(function (value) {
                _this.plugin.settings.prettyPreview = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                if (value) {
                    _this.plugin.enableContextualTypography();
                }
                else {
                    _this.plugin.disableContextualTypography();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Use system-level setting for light or dark mode")
            .setDesc("Automatically switch based on your operating system settings")
            .addToggle(function (toggle) {
            return toggle
                .setValue(_this.plugin.settings.useSystemTheme)
                .onChange(function (value) {
                _this.plugin.settings.useSystemTheme = value;
                _this.plugin.saveData(_this.plugin.settings);
                if (value) {
                    _this.plugin.listenForSystemTheme();
                }
                else {
                    _this.plugin.stopListeningForSystemTheme();
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Line width")
            .setDesc("The maximum number of characters per line (default 40)")
            .addText(function (text) {
            return text
                .setPlaceholder("42")
                .setValue((_this.plugin.settings.lineWidth || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.lineWidth = parseInt(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Body font size")
            .setDesc("Used for the main text (default 18)")
            .addText(function (text) {
            return text
                .setPlaceholder("18")
                .setValue((_this.plugin.settings.textNormal || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.textNormal = parseInt(value.trim());
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        containerEl.createEl("br");
        containerEl.createEl("h3", { text: "Custom fonts" });
        new obsidian.Setting(containerEl)
            .setName("UI font")
            .setDesc("Used for the user interface")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.textFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.textFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Editor font")
            .setDesc("Used for the editor and preview")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.editorFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.editorFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Editor font features")
            .setDesc('eg. "ss01", "cv05", "cv07", "case"')
            .addText(function (text) {
            return text
                .setPlaceholder('""')
                .setValue((_this.plugin.settings.fontFeatures || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.fontFeatures = value.trim();
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Monospace font")
            .setDesc("Used for code blocks, front matter, etc")
            .addText(function (text) {
            return text
                .setPlaceholder("")
                .setValue((_this.plugin.settings.monoFont || "") + "")
                .onChange(function (value) {
                _this.plugin.settings.monoFont = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
    };
    return ThemeSettingTab;
}(obsidian.PluginSettingTab));

module.exports = CaliforniaCoastTheme;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICBBcHAsXHJcbiAgUGx1Z2luLFxyXG4gIFBsdWdpblNldHRpbmdUYWIsXHJcbiAgU2V0dGluZyxcclxuICBXb3Jrc3BhY2VMZWFmLFxyXG59IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuY29uc3QgY29uZmlnID0ge1xyXG4gIGF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gIGNoaWxkTGlzdDogdHJ1ZSxcclxuICBzdWJ0cmVlOiBmYWxzZSxcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRhZ05vZGUobm9kZTogTm9kZSkge1xyXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBub2RlRWwgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICBpZiAoXHJcbiAgICAhbm9kZUVsLmRhdGFzZXQudGFnTmFtZSAmJlxyXG4gICAgbm9kZUVsLmhhc0NoaWxkTm9kZXMoKSAmJlxyXG4gICAgbm9kZUVsLmZpcnN0Q2hpbGQubm9kZVR5cGUgIT09IDNcclxuICApIHtcclxuICAgIGNvbnN0IGNoaWxkRWwgPSBub2RlLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICBub2RlRWwuZGF0YXNldC50YWdOYW1lID0gY2hpbGRFbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxpZm9ybmlhQ29hc3RUaGVtZSBleHRlbmRzIFBsdWdpbiB7XHJcbiAgc2V0dGluZ3M6IFRoZW1lU2V0dGluZ3M7XHJcbiAgbWVkaWE6IE1lZGlhUXVlcnlMaXN0IHwgbnVsbCA9IG51bGw7XHJcbiAgb2JzZXJ2ZXJzOiB7IFtpZDogc3RyaW5nXTogTXV0YXRpb25PYnNlcnZlciB9ID0ge307XHJcblxyXG4gIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB8fCBuZXcgVGhlbWVTZXR0aW5ncygpO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVGhlbWVTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcbiAgICB0aGlzLmFkZFN0eWxlKCk7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy51c2VTeXN0ZW1UaGVtZSkge1xyXG4gICAgICB0aGlzLmVuYWJsZVN5c3RlbVRoZW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICAhKHRoaXMuYXBwIGFzIGFueSkucGx1Z2lucy5wbHVnaW5zW1wib2JzaWRpYW4tY29udGV4dHVhbC10eXBvZ3JhcGh5XCJdICYmXHJcbiAgICAgIHRoaXMuc2V0dGluZ3MucHJldHR5UHJldmlld1xyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMuZW5hYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9udW5sb2FkKCkge1xyXG4gICAgdGhpcy5kaXNhYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkoKVxyXG4gIH1cclxuXHJcbiAgbWVkaWFDYWxsYmFjayA9IChlOiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB7XHJcbiAgICBpZiAoZS5tYXRjaGVzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRGFya1N0eWxlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZUxpZ2h0U3R5bGUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBsaXN0ZW5Gb3JTeXN0ZW1UaGVtZSA9ICgpID0+IHtcclxuICAgIHRoaXMubWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaylcIik7XHJcbiAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5tZWRpYUNhbGxiYWNrKTtcclxuICAgIHRoaXMucmVnaXN0ZXIoKCkgPT5cclxuICAgICAgdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVkaWFDYWxsYmFjaylcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHRoaXMubWVkaWEubWF0Y2hlcykge1xyXG4gICAgICB0aGlzLnVwZGF0ZURhcmtTdHlsZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGVMaWdodFN0eWxlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgc3RvcExpc3RlbmluZ0ZvclN5c3RlbVRoZW1lID0gKCkgPT4ge1xyXG4gICAgdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMubWVkaWFDYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgLy8gcmVmcmVzaCBmdW5jdGlvbiBmb3Igd2hlbiB3ZSBjaGFuZ2Ugc2V0dGluZ3NcclxuICByZWZyZXNoKCkge1xyXG4gICAgLy8gcmUtbG9hZCB0aGUgc3R5bGVcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIC8vIGFkZCB0aGUgc3R5bGluZyBlbGVtZW50cyB3ZSBuZWVkXHJcbiAgYWRkU3R5bGUoKSB7XHJcbiAgICAvLyBhZGQgYSBjc3MgYmxvY2sgZm9yIG91ciBzZXR0aW5ncy1kZXBlbmRlbnQgc3R5bGVzXHJcbiAgICBjb25zdCBjc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgICBjc3MuaWQgPSBcImNhbGlmb3JuaWEtY29hc3QtdGhlbWVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjc3MpO1xyXG5cclxuICAgIC8vIGFkZCB0aGUgbWFpbiBjbGFzc1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwiY2FsaWZvcm5pYS1jb2FzdC10aGVtZVwiKTtcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHN0eWxlIHdpdGggdGhlIHNldHRpbmdzLWRlcGVuZGVudCBzdHlsZXNcclxuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZVN0eWxlKCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDbGFzcyhcImNjLXByZXR0eS1lZGl0b3JcIiwgXCJjYy1wcmV0dHktcHJldmlld1wiKTtcclxuICB9XHJcblxyXG4gIC8vIHVwZGF0ZSB0aGUgc3R5bGVzIChhdCB0aGUgc3RhcnQsIG9yIGFzIHRoZSByZXN1bHQgb2YgYSBzZXR0aW5ncyBjaGFuZ2UpXHJcbiAgdXBkYXRlU3R5bGUoKSB7XHJcbiAgICB0aGlzLnJlbW92ZVN0eWxlKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXHJcbiAgICAgIFwiY2MtcHJldHR5LWVkaXRvclwiLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLnByZXR0eUVkaXRvclxyXG4gICAgKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcclxuICAgICAgXCJjYy1wcmV0dHktcHJldmlld1wiLFxyXG4gICAgICB0aGlzLnNldHRpbmdzLnByZXR0eVByZXZpZXdcclxuICAgICk7XHJcblxyXG4gICAgLy8gZ2V0IHRoZSBjdXN0b20gY3NzIGVsZW1lbnRcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxpZm9ybmlhLWNvYXN0LXRoZW1lXCIpO1xyXG4gICAgaWYgKCFlbCkgdGhyb3cgXCJjYWxpZm9ybmlhLWNvYXN0LXRoZW1lIGVsZW1lbnQgbm90IGZvdW5kIVwiO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vIHNldCB0aGUgc2V0dGluZ3MtZGVwZW5kZW50IGNzc1xyXG4gICAgICBlbC5pbm5lclRleHQgPSBgXHJcbiAgICAgICAgYm9keS5jYWxpZm9ybmlhLWNvYXN0LXRoZW1lIHtcclxuICAgICAgICAgIC0tZWRpdG9yLWZvbnQtc2l6ZToke3RoaXMuc2V0dGluZ3MudGV4dE5vcm1hbH1weDtcclxuICAgICAgICAgIC0tZWRpdG9yLWZvbnQtZmVhdHVyZXM6ICR7dGhpcy5zZXR0aW5ncy5mb250RmVhdHVyZXN9O1xyXG4gICAgICAgICAgLS1saW5lLXdpZHRoOiR7dGhpcy5zZXR0aW5ncy5saW5lV2lkdGh9cmVtO1xyXG4gICAgICAgICAgLS1mb250LW1vbm9zcGFjZToke3RoaXMuc2V0dGluZ3MubW9ub0ZvbnR9O1xyXG4gICAgICAgICAgLS10ZXh0OiR7dGhpcy5zZXR0aW5ncy50ZXh0Rm9udH07XHJcbiAgICAgICAgICAtLXRleHQtZWRpdG9yOiR7dGhpcy5zZXR0aW5ncy5lZGl0b3JGb250fTtcclxuICAgICAgICB9XHJcbiAgICAgIGAudHJpbSgpLnJlcGxhY2UoL1tcXHJcXG5cXHNdKy9nLCAnICcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW5hYmxlU3lzdGVtVGhlbWUoKSB7XHJcbiAgICAodGhpcy5hcHAud29ya3NwYWNlIGFzIGFueSkubGF5b3V0UmVhZHlcclxuICAgICAgPyB0aGlzLmxpc3RlbkZvclN5c3RlbVRoZW1lKClcclxuICAgICAgOiB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtcmVhZHlcIiwgdGhpcy5saXN0ZW5Gb3JTeXN0ZW1UaGVtZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEYXJrU3R5bGUoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKFwidGhlbWUtbGlnaHRcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZENsYXNzKFwidGhlbWUtZGFya1wiKTtcclxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS50cmlnZ2VyKFwiY3NzLWNoYW5nZVwiKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUxpZ2h0U3R5bGUoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKFwidGhlbWUtZGFya1wiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkQ2xhc3MoXCJ0aGVtZS1saWdodFwiKTtcclxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS50cmlnZ2VyKFwiY3NzLWNoYW5nZVwiKTtcclxuICB9XHJcblxyXG4gIGRpc2Nvbm5lY3RPYnNlcnZlcihpZDogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbaWRdKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2lkXS5kaXNjb25uZWN0KCk7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyc1tpZF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25uZWN0T2JzZXJ2ZXIoaWQ6IHN0cmluZywgbGVhZjogV29ya3NwYWNlTGVhZikge1xyXG4gICAgaWYgKHRoaXMub2JzZXJ2ZXJzW2lkXSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHByZXZpZXdTZWN0aW9uID0gbGVhZi52aWV3LmNvbnRhaW5lckVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgIFwibWFya2Rvd24tcHJldmlldy1zZWN0aW9uXCJcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHByZXZpZXdTZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1tpZF0gPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XHJcbiAgICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XHJcbiAgICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2godGFnTm9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5vYnNlcnZlcnNbaWRdLm9ic2VydmUocHJldmlld1NlY3Rpb25bMF0sIGNvbmZpZyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBwcmV2aWV3U2VjdGlvblswXS5jaGlsZE5vZGVzLmZvckVhY2godGFnTm9kZSk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW5hYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlZW46IHsgW2s6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xyXG5cclxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZVJvb3RMZWF2ZXMoKGxlYWYpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlkID0gKGxlYWYgYXMgYW55KS5pZCBhcyBzdHJpbmc7XHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3RPYnNlcnZlcihpZCwgbGVhZik7XHJcbiAgICAgICAgICBzZWVuW2lkXSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMub2JzZXJ2ZXJzKS5mb3JFYWNoKChrKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXNlZW5ba10pIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0T2JzZXJ2ZXIoayk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGlzYWJsZUNvbnRleHR1YWxUeXBvZ3JhcGh5ID0gKCkgPT4ge1xyXG4gICAgT2JqZWN0LmtleXModGhpcy5vYnNlcnZlcnMpLmZvckVhY2goKGspID0+IHRoaXMuZGlzY29ubmVjdE9ic2VydmVyKGspKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIFRoZW1lU2V0dGluZ3Mge1xyXG4gIHByZXR0eUVkaXRvcjogYm9vbGVhbiA9IHRydWU7XHJcbiAgcHJldHR5UHJldmlldzogYm9vbGVhbiA9IHRydWU7XHJcbiAgdXNlU3lzdGVtVGhlbWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgbGluZVdpZHRoOiBudW1iZXIgPSA0MjtcclxuICB0ZXh0Tm9ybWFsOiBudW1iZXIgPSAxODtcclxuXHJcbiAgZm9udEZlYXR1cmVzOiBzdHJpbmcgPSAnXCJcIic7XHJcblxyXG4gIHRleHRGb250OiBzdHJpbmcgPVxyXG4gICAgJy1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFwiU2Vnb2UgVUkgRW1vamlcIixcIlNlZ29lIFVJXCIsUm9ib3RvLE94eWdlbi1TYW5zLFVidW50dSxDYW50YXJlbGwsc2Fucy1zZXJpZic7XHJcblxyXG4gIGVkaXRvckZvbnQ6IHN0cmluZyA9XHJcbiAgICAnLWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsXCJTZWdvZSBVSSBFbW9qaVwiLFwiU2Vnb2UgVUlcIixSb2JvdG8sT3h5Z2VuLVNhbnMsVWJ1bnR1LENhbnRhcmVsbCxzYW5zLXNlcmlmJztcclxuXHJcbiAgbW9ub0ZvbnQ6IHN0cmluZyA9IFwiTWVubG8sU0ZNb25vLVJlZ3VsYXIsQ29uc29sYXMsUm9ib3RvIE1vbm8sbW9ub3NwYWNlXCI7XHJcbn1cclxuXHJcbmNsYXNzIFRoZW1lU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gIHBsdWdpbjogQ2FsaWZvcm5pYUNvYXN0VGhlbWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IENhbGlmb3JuaWFDb2FzdFRoZW1lKSB7XHJcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICB9XHJcblxyXG4gIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHJcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IFwiQ2FsaWZvcm5pYSBDb2FzdCBUaGVtZVwiIH0pO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVuaGFuY2VkIEVkaXRvciBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIGVkaXRvciBtb2RlXCIpXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucHJldHR5RWRpdG9yKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnByZXR0eUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZWQgUHJldmlldyBUeXBvZ3JhcGh5XCIpXHJcbiAgICAgIC5zZXREZXNjKFxyXG4gICAgICAgIFwiRW5oYW5jZXMgdGhlIHR5cG9ncmFwaHkgc3R5bGVzIGluIHByZXZpZXcgbW9kZS4gVGhlIENvbnRleHR1YWwgVHlwb2dyYXBoeSBwbHVnaW4gaXMgcmVjb21tZW5kZWRcIlxyXG4gICAgICApXHJcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cclxuICAgICAgICB0b2dnbGVcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3KVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wcmV0dHlQcmV2aWV3ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZW5hYmxlQ29udGV4dHVhbFR5cG9ncmFwaHkoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRpc2FibGVDb250ZXh0dWFsVHlwb2dyYXBoeSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKFwiVXNlIHN5c3RlbS1sZXZlbCBzZXR0aW5nIGZvciBsaWdodCBvciBkYXJrIG1vZGVcIilcclxuICAgICAgLnNldERlc2MoXCJBdXRvbWF0aWNhbGx5IHN3aXRjaCBiYXNlZCBvbiB5b3VyIG9wZXJhdGluZyBzeXN0ZW0gc2V0dGluZ3NcIilcclxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxyXG4gICAgICAgIHRvZ2dsZVxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZVN5c3RlbVRoZW1lKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VTeXN0ZW1UaGVtZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5saXN0ZW5Gb3JTeXN0ZW1UaGVtZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnN0b3BMaXN0ZW5pbmdGb3JTeXN0ZW1UaGVtZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkxpbmUgd2lkdGhcIilcclxuICAgICAgLnNldERlc2MoXCJUaGUgbWF4aW11bSBudW1iZXIgb2YgY2hhcmFjdGVycyBwZXIgbGluZSAoZGVmYXVsdCA0MClcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiNDJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MubGluZVdpZHRoIHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubGluZVdpZHRoID0gcGFyc2VJbnQodmFsdWUudHJpbSgpKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkJvZHkgZm9udCBzaXplXCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgdGhlIG1haW4gdGV4dCAoZGVmYXVsdCAxOClcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiMThcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dE5vcm1hbCB8fCBcIlwiKSArIFwiXCIpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHROb3JtYWwgPSBwYXJzZUludCh2YWx1ZS50cmltKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJiclwiKTtcclxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBcIkN1c3RvbSBmb250c1wiIH0pO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIlVJIGZvbnRcIilcclxuICAgICAgLnNldERlc2MoXCJVc2VkIGZvciB0aGUgdXNlciBpbnRlcmZhY2VcIilcclxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XHJcbiAgICAgICAgdGV4dFxyXG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiXCIpXHJcbiAgICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLnRleHRGb250IHx8IFwiXCIpICsgXCJcIilcclxuICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dEZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVkaXRvciBmb250XCIpXHJcbiAgICAgIC5zZXREZXNjKFwiVXNlZCBmb3IgdGhlIGVkaXRvciBhbmQgcHJldmlld1wiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MuZWRpdG9yRm9udCB8fCBcIlwiKSArIFwiXCIpXHJcbiAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVkaXRvckZvbnQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZShcIkVkaXRvciBmb250IGZlYXR1cmVzXCIpXHJcbiAgICAgIC5zZXREZXNjKCdlZy4gXCJzczAxXCIsIFwiY3YwNVwiLCBcImN2MDdcIiwgXCJjYXNlXCInKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ1wiXCInKVxyXG4gICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250RmVhdHVyZXMgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb250RmVhdHVyZXMgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoXCJNb25vc3BhY2UgZm9udFwiKVxyXG4gICAgICAuc2V0RGVzYyhcIlVzZWQgZm9yIGNvZGUgYmxvY2tzLCBmcm9udCBtYXR0ZXIsIGV0Y1wiKVxyXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cclxuICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJcIilcclxuICAgICAgICAgIC5zZXRWYWx1ZSgodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9ub0ZvbnQgfHwgXCJcIikgKyBcIlwiKVxyXG4gICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb25vRm9udCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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
