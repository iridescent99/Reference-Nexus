import {ItemView, WorkspaceLeaf} from "obsidian";
import ReferenceNexus from "../index";
import "./view.css";

export const VIEW_TYPE_CUSTOM = "reference-view";

export class ReferenceView extends ItemView {

    plugin: ReferenceNexus;

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
            const container = this.contentEl.createDiv({cls: "reference-container"});
            container.createDiv({text: reference.title, cls: "reference-title"}).style.fontStyle = "italic";
            container.createDiv({text: reference.authors.join(", "), cls: "reference-authors"});
            container.createDiv({text: reference.type, cls: "reference-type"})
            const metrics = container.createDiv({cls: "reference-metrics"});
            for (let metric of reference.metrics) {
                const metricContainer = metrics.createDiv( {cls: `metric-container-${metric}`} );
                metricContainer.createDiv({ cls: `metric-${metric}` })
            }
        }
        // const description = container.createEl('p', { text: 'This is a custom side pane in Obsidian!' });
    }


    protected onClose(): Promise<void> {
        this.leaf.detach();
    }

}