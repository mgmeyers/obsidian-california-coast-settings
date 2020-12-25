import { App, WorkspaceLeaf } from "obsidian";

export default class EmbeddedHeadingsExtension {
  headings: { [id: string]: WorkspaceLeaf } = {};

  removeHeading(id: string, leaf: WorkspaceLeaf) {
    if (!this.headings[id]) return;

    const h1Edit = document.getElementById(`${id}-edit`);
    const h1Preview = document.getElementById(`${id}-preview`);

    if (h1Edit) h1Edit.remove();
    if (h1Preview) h1Preview.remove();

    delete this.headings[id];
  }

  createHeading(id: string, leaf: WorkspaceLeaf) {
    if (this.headings[id]) return;

    const header = leaf.view.containerEl.getElementsByClassName(
      "view-header-title"
    );

    const viewContent = leaf.view.containerEl.getElementsByClassName(
      "CodeMirror-scroll"
    );

    const previewContent = leaf.view.containerEl.getElementsByClassName(
      "markdown-preview-view"
    );

    if (header.length && viewContent.length && previewContent.length) {
      const editEl = viewContent[0] as HTMLDivElement;
      const h1Edit = document.createElement("h1");

      h1Edit.setText((header[0] as HTMLDivElement).innerText);
      h1Edit.id = `${id}-edit`;
      editEl.prepend(h1Edit);

      const previewEl = previewContent[0] as HTMLDivElement;
      const h1Preview = document.createElement("h1");

      h1Preview.setText((header[0] as HTMLDivElement).innerText);
      h1Preview.id = `${id}-preview`;
      previewEl.prepend(h1Preview);

      this.headings[id] = leaf;
    }
  }

  getLeafId(leaf: WorkspaceLeaf) {
    const viewState = leaf.getViewState();

    if (viewState.type === "markdown") {
      return (
        "title-" +
        (((leaf as any).id as string) + viewState.state.file).replace(
          /^[^a-z]+|[^\w:.-]+/gi,
          ""
        )
      );
    }

    return null;
  }

  createHeadings(app: App) {
    const seen: { [k: string]: boolean } = {};

    app.workspace.iterateRootLeaves((leaf) => {
      const id = this.getLeafId(leaf);

      if (id) {
        this.createHeading(id, leaf);
        seen[id] = true;
      }
    });

    Object.keys(this.headings).forEach((id) => {
      if (!seen[id]) {
        this.removeHeading(id, this.headings[id]);
      }
    });
  }

  onload() {
    document.body.classList.add("embedded-note-title");
  }

  onunload() {
    document.body.classList.remove("embedded-note-title");

    Object.keys(this.headings).forEach((id) => {
      this.removeHeading(id, this.headings[id]);
    });
  }
}
