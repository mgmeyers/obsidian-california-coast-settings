import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from "obsidian";

import EmbeddedHeadingsExtension from "./extensions/embeddedHeadings";
import { initIcons } from "./extensions/boxicons";
import {
  numberOrDefault,
  populatedArrayOrDefault,
  stringOrDefault,
} from "helpers";

initIcons();

interface HeadingConfig {
  size: string;
  lineHeight: number;
  marginTop: number;
  marginBottom: number;
  weight: number;
  style: string;
}

class ThemeSettings {
  prettyEditor: boolean = true;
  prettyPreview: boolean = true;
  embeddedHeadings: boolean = false;
  useSystemTheme: boolean = false;
  fancyCursor: boolean = false;
  accentHue: number = 211;
  accentSat: number = 100;

  lineWidth: number = 42;
  textNormal: number = 18;

  fontFeatures: string = '""';

  textFont: string =
    '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';

  editorFont: string =
    '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';
  editorLineHeight: number = 1.88889;

  monoFont: string = "Menlo,SFMono-Regular,Consolas,Roboto Mono,monospace";

  headingConfig: HeadingConfig[] = [
    {
      size: "1.602rem",
      lineHeight: 1.4,
      marginTop: 4,
      marginBottom: 1,
      weight: 500,
      style: "normal",
    },
    {
      size: "1.424rem",
      lineHeight: 1.4,
      marginTop: 2.5,
      marginBottom: 0.5,
      weight: 500,
      style: "normal",
    },
    {
      size: "1.266rem",
      lineHeight: 1.4,
      marginTop: 2,
      marginBottom: 0.5,
      weight: 500,
      style: "normal",
    },
    {
      size: "1.125rem",
      lineHeight: 1.5,
      marginTop: 1.5,
      marginBottom: 0.5,
      weight: 500,
      style: "normal",
    },
    {
      size: "1rem",
      lineHeight: 1.5,
      marginTop: 1.5,
      marginBottom: 0.5,
      weight: 500,
      style: "normal",
    },
    {
      size: "1rem",
      lineHeight: 1.5,
      marginTop: 1.5,
      marginBottom: 0.5,
      weight: 500,
      style: "italic",
    },
  ];
}

const defaultSettings = new ThemeSettings();

const observerConfig = {
  attributes: false,
  childList: true,
  subtree: false,
};

function tagNode(node: Node) {
  if (node.nodeType === 3) {
    return;
  }

  const nodeEl = node as HTMLElement;

  if (
    !nodeEl.dataset.tagName &&
    nodeEl.hasChildNodes() &&
    nodeEl.firstChild.nodeType !== 3
  ) {
    const childEl = node.firstChild as HTMLElement;
    nodeEl.dataset.tagName = childEl.tagName.toLowerCase();
  }
}

export default class CaliforniaCoastTheme extends Plugin {
  settings: ThemeSettings;
  media: MediaQueryList | null = null;
  observers: { [id: string]: MutationObserver } = {};
  embeddedHeadings: EmbeddedHeadingsExtension;

  async onload() {
    this.embeddedHeadings = new EmbeddedHeadingsExtension();

    this.settings = (await this.loadData()) || new ThemeSettings();

    this.addSettingTab(new ThemeSettingTab(this.app, this));
    this.addStyle();
    this.refresh();

    if (this.settings.useSystemTheme) {
      this.enableSystemTheme();
    }

    if (
      !(this.app as any).plugins.plugins["obsidian-contextual-typography"] &&
      this.settings.prettyPreview
    ) {
      this.enableContextualTypography();
    }

    if (this.settings.embeddedHeadings) {
      this.enableEmbeddedHeadings();
    }
  }

  onunload() {
    this.disableContextualTypography();
    this.disableEmbeddedHeadings();
  }

  mediaCallback = (e: MediaQueryListEvent) => {
    if (e.matches) {
      this.updateDarkStyle();
    } else {
      this.updateLightStyle();
    }
  };

  listenForSystemTheme = () => {
    this.media = window.matchMedia("(prefers-color-scheme: dark)");
    this.media.addEventListener("change", this.mediaCallback);
    this.register(() =>
      this.media.removeEventListener("change", this.mediaCallback)
    );

    if (this.media.matches) {
      this.updateDarkStyle();
    } else {
      this.updateLightStyle();
    }
  };

  stopListeningForSystemTheme = () => {
    this.media.removeEventListener("change", this.mediaCallback);
  };

  // refresh function for when we change settings
  refresh() {
    this.updateStyle();
  }

  // add the styling elements we need
  addStyle() {
    const css = document.createElement("style");
    css.id = "california-coast-theme";
    document.getElementsByTagName("head")[0].appendChild(css);

    // add the main class
    document.body.classList.add("california-coast-theme");

    // update the style with the settings-dependent styles
    this.updateStyle();
  }

  removeStyle() {
    document.body.removeClass(
      "cc-pretty-editor",
      "cc-pretty-preview",
      "fancy-cursor"
    );
  }

  // update the styles (at the start, or as the result of a settings change)
  updateStyle() {
    this.removeStyle();

    document.body.classList.toggle(
      "cc-pretty-editor",
      this.settings.prettyEditor
    );
    document.body.classList.toggle(
      "cc-pretty-preview",
      this.settings.prettyPreview
    );
    document.body.classList.toggle("fancy-cursor", this.settings.fancyCursor);

    // get the custom css element
    const el = document.getElementById("california-coast-theme");

    if (!el) {
      throw "california-coast-theme element not found!";
    } else {
      const headingConfig = populatedArrayOrDefault<HeadingConfig>(
        this.settings.headingConfig,
        defaultSettings.headingConfig
      );

      // set the settings-dependent css
      el.innerText = `
        body.california-coast-theme {
          --editor-font-size: ${numberOrDefault(
            this.settings.textNormal,
            defaultSettings.textNormal
          )}px;
          --editor-font-features: ${stringOrDefault(
            this.settings.fontFeatures,
            defaultSettings.fontFeatures
          )};
          --editor-line-height: ${numberOrDefault(
            this.settings.editorLineHeight,
            defaultSettings.editorLineHeight
          )};
          --editor-line-height-rem: ${numberOrDefault(
            this.settings.editorLineHeight,
            defaultSettings.editorLineHeight
          )}rem;
          --line-width: ${numberOrDefault(
            this.settings.lineWidth,
            defaultSettings.lineWidth
          )}rem;
          --font-monospace: ${stringOrDefault(
            this.settings.monoFont,
            defaultSettings.monoFont
          )};
          --text: ${stringOrDefault(
            this.settings.textFont,
            defaultSettings.textFont
          )};
          --text-editor: ${stringOrDefault(
            this.settings.editorFont,
            defaultSettings.editorFont
          )};
          --accent-h: ${numberOrDefault(
            this.settings.accentHue,
            defaultSettings.accentHue
          )};
          --accent-s: ${numberOrDefault(
            this.settings.accentSat,
            defaultSettings.accentSat
          )}%;

          ${headingConfig
            .map(
              (c, i) => `
              --h${i + 1}-size: ${c.size};
              --h${i + 1}-line-height: ${c.lineHeight};
              --h${i + 1}-margin-top: ${c.marginTop};
              --h${i + 1}-margin-bottom: ${c.marginBottom}; 
              --h${i + 1}-weight: ${c.weight}; 
              --h${i + 1}-style: ${c.style}; 
            `
            )
            .join(" ")}
        }
      `
        .trim()
        .replace(/[\r\n\s]+/g, " ");
    }
  }

  enableSystemTheme() {
    (this.app.workspace as any).layoutReady
      ? this.listenForSystemTheme()
      : this.app.workspace.on("layout-ready", this.listenForSystemTheme);
  }

  updateDarkStyle() {
    document.body.removeClass("theme-light");
    document.body.addClass("theme-dark");
    this.app.workspace.trigger("css-change");
  }

  updateLightStyle() {
    document.body.removeClass("theme-dark");
    document.body.addClass("theme-light");
    this.app.workspace.trigger("css-change");
  }

  disconnectObserver(id: string) {
    if (this.observers[id]) {
      this.observers[id].disconnect();
      delete this.observers[id];
    }
  }

  connectObserver(id: string, leaf: WorkspaceLeaf) {
    if (this.observers[id]) return;

    const previewSection = leaf.view.containerEl.getElementsByClassName(
      "markdown-preview-section"
    );

    if (previewSection.length) {
      this.observers[id] = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(tagNode);
        });
      });

      this.observers[id].observe(previewSection[0], observerConfig);

      setTimeout(() => {
        previewSection[0].childNodes.forEach(tagNode);
      }, 0);
    }
  }

  enableContextualTypography = () => {
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        if (this.settings.prettyPreview) {
          const seen: { [k: string]: boolean } = {};

          this.app.workspace.iterateRootLeaves((leaf) => {
            const id = (leaf as any).id as string;
            this.connectObserver(id, leaf);
            seen[id] = true;
          });

          Object.keys(this.observers).forEach((k) => {
            if (!seen[k]) {
              this.disconnectObserver(k);
            }
          });
        }
      })
    );
  };

  disableContextualTypography = () => {
    Object.keys(this.observers).forEach((k) => this.disconnectObserver(k));
  };

  enableEmbeddedHeadings = () => {
    this.embeddedHeadings.onload();

    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        if (this.settings.embeddedHeadings) {
          setTimeout(() => {
            this.embeddedHeadings.createHeadings(this.app);
          }, 0);
        }
      })
    );
  };

  disableEmbeddedHeadings = () => {
    this.embeddedHeadings.onunload();
  };
}

class ThemeSettingTab extends PluginSettingTab {
  plugin: CaliforniaCoastTheme;

  constructor(app: App, plugin: CaliforniaCoastTheme) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h3", { text: "California Coast Theme" });
    containerEl.createEl("br");
    containerEl.createEl("a", { text: "⬤ Accent Color" });
    containerEl.createEl("h3");

    new Setting(containerEl)
      .setName("Reset accent color")
      .setDesc("Set accent color back to theme default")
      .addButton((button) =>
        button.setButtonText("Reset").onClick(() => {
          this.plugin.settings.accentHue = defaultSettings.accentHue;
          this.plugin.settings.accentSat = defaultSettings.accentSat;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        })
      );

    new Setting(containerEl)
      .setName("Accent color hue")
      .setDesc("For links and interactive elements")
      .addSlider((slider) =>
        slider
          .setLimits(0, 360, 1)
          .setValue(
            typeof this.plugin.settings.accentHue === "number"
              ? this.plugin.settings.accentHue
              : defaultSettings.accentHue
          )
          .onChange((value) => {
            this.plugin.settings.accentHue = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Accent color saturation")
      .setDesc("For links and interactive elements")
      .addSlider((slider) =>
        slider
          .setLimits(0, 100, 1)
          .setValue(
            typeof this.plugin.settings.accentSat === "number"
              ? this.plugin.settings.accentSat
              : defaultSettings.accentSat
          )
          .onChange((value) => {
            this.plugin.settings.accentSat = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Accented cursor")
      .setDesc("The editor cursor takes on your accent color")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.fancyCursor).onChange((value) => {
          this.plugin.settings.fancyCursor = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        })
      );

    new Setting(containerEl)
      .setName("Use system-level setting for light or dark mode")
      .setDesc("Automatically switch based on your operating system settings")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useSystemTheme)
          .onChange((value) => {
            this.plugin.settings.useSystemTheme = value;
            this.plugin.saveData(this.plugin.settings);

            if (value) {
              this.plugin.listenForSystemTheme();
            } else {
              this.plugin.stopListeningForSystemTheme();
            }
          })
      );

    containerEl.createEl("br");
    containerEl.createEl("h3", { text: "Custom fonts" });

    new Setting(containerEl)
      .setName("UI font")
      .setDesc("Used for the user interface")
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(
            (this.plugin.settings.textFont || defaultSettings.textFont) + ""
          )
          .onChange((value) => {
            this.plugin.settings.textFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Body font")
      .setDesc("Used for the editor and preview")
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(
            (this.plugin.settings.editorFont || defaultSettings.editorFont) + ""
          )
          .onChange((value) => {
            this.plugin.settings.editorFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Body font features")
      .setDesc('eg. "ss01", "cv05", "cv07", "case"')
      .addText((text) =>
        text
          .setPlaceholder('""')
          .setValue(
            (this.plugin.settings.fontFeatures ||
              defaultSettings.fontFeatures) + ""
          )
          .onChange((value) => {
            this.plugin.settings.fontFeatures = value.trim();
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Monospace font")
      .setDesc("Used for code blocks, front matter, etc")
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(
            (this.plugin.settings.monoFont || defaultSettings.monoFont) + ""
          )
          .onChange((value) => {
            this.plugin.settings.monoFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    containerEl.createEl("br");
    containerEl.createEl("h3", { text: "Typography" });

    new Setting(containerEl)
      .setName("Display note file names as headings")
      .setDesc("Embeds note titles as top level H1 tags")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.embeddedHeadings)
          .onChange((value) => {
            this.plugin.settings.embeddedHeadings = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();

            if (value) {
              this.plugin.enableEmbeddedHeadings();
            } else {
              this.plugin.disableEmbeddedHeadings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Enhanced Editor Typography")
      .setDesc("Adds WYSIWYG-like functionality to editor mode")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.prettyEditor).onChange((value) => {
          this.plugin.settings.prettyEditor = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        })
      );

    new Setting(containerEl)
      .setName("Enhanced Preview Typography")
      .setDesc(
        "Adds context aware padding between text elements in preview mode"
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.prettyPreview)
          .onChange((value) => {
            this.plugin.settings.prettyPreview = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();

            if (value) {
              this.plugin.enableContextualTypography();
            } else {
              this.plugin.disableContextualTypography();
            }
          })
      );

    new Setting(containerEl)
      .setName("Line width")
      .setDesc("The maximum number of characters per line (default 42)")
      .addText((text) =>
        text
          .setPlaceholder("42")
          .setValue(
            (this.plugin.settings.lineWidth || defaultSettings.lineWidth) + ""
          )
          .onChange((value) => {
            this.plugin.settings.lineWidth = parseInt(value.trim());
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Body font size")
      .setDesc("Used for the main text (default 18)")
      .addText((text) =>
        text
          .setPlaceholder("18")
          .setValue(
            (this.plugin.settings.textNormal || defaultSettings.textNormal) + ""
          )
          .onChange((value) => {
            this.plugin.settings.textNormal = parseInt(value.trim());
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Body line height")
      .setDesc("Used for the main text (default 1.88889)")
      .addText((text) =>
        text
          .setPlaceholder("1.88889")
          .setValue(
            (this.plugin.settings.editorLineHeight ||
              defaultSettings.editorLineHeight) + ""
          )
          .onChange((value) => {
            this.plugin.settings.editorLineHeight = parseFloat(value.trim());
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    if (
      !this.plugin.settings.headingConfig ||
      this.plugin.settings.headingConfig.length === 0
    ) {
      this.plugin.settings.headingConfig = defaultSettings.headingConfig.map(
        (c) => ({
          ...c,
        })
      );
    }

    this.plugin.settings.headingConfig.forEach((c, i) => {
      const index = i;

      containerEl.createEl("h4", { text: `Level ${i + 1} Headings` });

      new Setting(containerEl)
        .setName(`H${index + 1} font size`)
        .setDesc(
          `Accepts any CSS font-size value (default ${defaultSettings.headingConfig[index].size})`
        )
        .addText((text) =>
          text
            .setPlaceholder(defaultSettings.headingConfig[index].size)
            .setValue(c.size)
            .onChange((value) => {
              this.plugin.settings.headingConfig[index].size = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );

      new Setting(containerEl)
        .setName(`H${index + 1} line height`)
        .setDesc(
          `Accepts decimal values (default ${defaultSettings.headingConfig[index].lineHeight})`
        )
        .addText((text) =>
          text
            .setPlaceholder(
              defaultSettings.headingConfig[index].lineHeight + ""
            )
            .setValue(c.lineHeight + "")
            .onChange((value) => {
              this.plugin.settings.headingConfig[index].lineHeight = parseFloat(
                value
              );
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );

      new Setting(containerEl)
        .setName(`H${index + 1} top margin`)
        .setDesc(
          `Accepts decimal values representing the number of lines to add before the heading (default ${defaultSettings.headingConfig[index].marginTop})`
        )
        .addText((text) =>
          text
            .setPlaceholder(defaultSettings.headingConfig[index].marginTop + "")
            .setValue(c.marginTop + "")
            .onChange((value) => {
              this.plugin.settings.headingConfig[index].marginTop = parseFloat(
                value
              );
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );

      new Setting(containerEl)
        .setName(`H${index + 1} bottom margin`)
        .setDesc(
          `Accepts decimal values representing the number of lines to add below the heading (default ${defaultSettings.headingConfig[index].marginBottom})`
        )
        .addText((text) =>
          text
            .setPlaceholder(
              defaultSettings.headingConfig[index].marginBottom + ""
            )
            .setValue(c.marginBottom + "")
            .onChange((value) => {
              this.plugin.settings.headingConfig[
                index
              ].marginBottom = parseFloat(value);
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );

      new Setting(containerEl)
        .setName(`H${index + 1} font weight`)
        .setDesc(
          `Accepts numbers represeting the CSS font-weight (default ${defaultSettings.headingConfig[index].weight})`
        )
        .addText((text) =>
          text
            .setPlaceholder(defaultSettings.headingConfig[index].weight + "")
            .setValue(c.weight + "")
            .onChange((value) => {
              this.plugin.settings.headingConfig[index].weight = parseFloat(
                value
              );
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );

      new Setting(containerEl)
        .setName(`H${index + 1} font style`)
        .setDesc(
          `Accepts any CSS font-style value (default ${defaultSettings.headingConfig[index].style})`
        )
        .addText((text) =>
          text
            .setPlaceholder(defaultSettings.headingConfig[index].style)
            .setValue(c.style)
            .onChange((value) => {
              this.plugin.settings.headingConfig[index].style = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.refresh();
            })
        );
    });
  }
}
