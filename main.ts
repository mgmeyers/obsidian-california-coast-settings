import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from "obsidian";

import EmbeddedHeadingsExtension from "./extensions/embeddedHeadings";
import { initIcons } from './extensions/boxicons'

initIcons();

const config = {
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
    // re-load the style
    this.updateStyle();
  }

  // add the styling elements we need
  addStyle() {
    // add a css block for our settings-dependent styles
    const css = document.createElement("style");
    css.id = "california-coast-theme";
    document.getElementsByTagName("head")[0].appendChild(css);

    // add the main class
    document.body.classList.add("california-coast-theme");

    // update the style with the settings-dependent styles
    this.updateStyle();
  }

  removeStyle() {
    document.body.removeClass("cc-pretty-editor", "cc-pretty-preview");
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

    // get the custom css element
    const el = document.getElementById("california-coast-theme");
    if (!el) throw "california-coast-theme element not found!";
    else {
      // set the settings-dependent css
      el.innerText = `
        body.california-coast-theme {
          --editor-font-size:${this.settings.textNormal}px;
          --editor-font-features: ${this.settings.fontFeatures};
          --line-width:${this.settings.lineWidth}rem;
          --font-monospace:${this.settings.monoFont};
          --text:${this.settings.textFont};
          --text-editor:${this.settings.editorFont};
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

      this.observers[id].observe(previewSection[0], config);

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
          this.embeddedHeadings.createHeadings(this.app);
        }
      })
    );
  };

  disableEmbeddedHeadings = () => {
    this.embeddedHeadings.onunload();
  };
}

class ThemeSettings {
  prettyEditor: boolean = true;
  prettyPreview: boolean = true;
  embeddedHeadings: boolean = false;
  useSystemTheme: boolean = false;

  lineWidth: number = 42;
  textNormal: number = 18;

  fontFeatures: string = '""';

  textFont: string =
    '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';

  editorFont: string =
    '-apple-system,BlinkMacSystemFont,"Segoe UI Emoji","Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif';

  monoFont: string = "Menlo,SFMono-Regular,Consolas,Roboto Mono,monospace";
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

    new Setting(containerEl)
      .setName("Enhanced Editor Typography")
      .setDesc("Enhances the typography styles in editor mode")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.prettyEditor).onChange((value) => {
          this.plugin.settings.prettyEditor = value;
          this.plugin.saveData(this.plugin.settings);
          this.plugin.refresh();
        })
      );

    new Setting(containerEl)
      .setName("Enhanced Preview Typography")
      .setDesc("Enhances the typography styles in preview mode")
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

    new Setting(containerEl)
      .setName("Line width")
      .setDesc("The maximum number of characters per line (default 40)")
      .addText((text) =>
        text
          .setPlaceholder("42")
          .setValue((this.plugin.settings.lineWidth || "") + "")
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
          .setValue((this.plugin.settings.textNormal || "") + "")
          .onChange((value) => {
            this.plugin.settings.textNormal = parseInt(value.trim());
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
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
          .setValue((this.plugin.settings.textFont || "") + "")
          .onChange((value) => {
            this.plugin.settings.textFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Editor font")
      .setDesc("Used for the editor and preview")
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue((this.plugin.settings.editorFont || "") + "")
          .onChange((value) => {
            this.plugin.settings.editorFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );

    new Setting(containerEl)
      .setName("Editor font features")
      .setDesc('eg. "ss01", "cv05", "cv07", "case"')
      .addText((text) =>
        text
          .setPlaceholder('""')
          .setValue((this.plugin.settings.fontFeatures || "") + "")
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
          .setValue((this.plugin.settings.monoFont || "") + "")
          .onChange((value) => {
            this.plugin.settings.monoFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
          })
      );
  }
}
