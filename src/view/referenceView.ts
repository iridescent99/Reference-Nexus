import {ItemView, WorkspaceLeaf} from "obsidian";
import ReferenceNexus from "../index";
import "./view.css";
import {ReferenceCard} from "./referenceCard";

export const VIEW_TYPE_CUSTOM = "reference-view";

export class ReferenceView extends ItemView {

    plugin: ReferenceNexus;
    private onDestroy: Function[] = [];

    constructor( plugin: ReferenceNexus, leaf: WorkspaceLeaf ) {
        super(leaf);
        this.plugin = plugin;
    }

    getDisplayText(): string {
        return "";
    }

    getViewType(): string {
        return "";
    }

    calculateMetricColor(  ) {

    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]; // Access the container
        container.empty();
        this.contentEl.createEl("h2", { text: "Reference view" })
        this.contentEl.createEl("input", { placeholder: "search reference.. ", cls: "reference-view-search"})
        for (let reference of this.plugin.referenceManager.references) {

            new ReferenceCard( this, reference )

        }
        // const description = container.createEl('p', { text: 'This is a custom side pane in Obsidian!' });
    }

    onunload() {
        this.onDestroy.forEach((fn: Function) => fn());
        super.onunload();
    }

    addOnUnload( fn: Function ) {
        this.onDestroy.push(fn);
    }

}