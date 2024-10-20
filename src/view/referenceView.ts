import {ItemView, Setting, WorkspaceLeaf} from "obsidian";
import ReferenceNexus from "../index";
import "./view.css";
import {ReferenceCard} from "./referenceCard";
import {IReference} from "../reference_nexus";

export const VIEW_TYPE_CUSTOM = "reference-view";

export class ReferenceView extends ItemView {

    plugin: ReferenceNexus;
    filteredReferences: IReference[] = [];
    referenceContainer: HTMLElement;
    query: string = "";

    constructor( plugin: ReferenceNexus, leaf: WorkspaceLeaf ) {
        super(leaf);
        this.plugin = plugin;
        this.filteredReferences = this.plugin.referenceManager.references;
        this.plugin.referenceManager.setCallback( () => this.loadReferences( this ) );
    }

    getDisplayText(): string {
        return "";
    }

    getViewType(): string {
        return "";
    }

    filter( query: string ) {
        if (query === "") this.filteredReferences = this.plugin.referenceManager.references;
        this.filteredReferences = this.filteredReferences.filter((reference: IReference) => {
            return Object.values(reference).filter((val: any) => {
                    if (typeof val === "string" && (val.toLowerCase().includes(query.toLowerCase()) || val.toLowerCase() === query.toLowerCase())) return true;
                }
            ).length > 0;
        })
    }

    protected async onOpen(): Promise<void> {
        this.loadComponents();
        this.loadReferences();
    }

    loadComponents() {

        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: "Reference view" })

        new Setting(contentEl)
            .addSearch((cb) => {
                cb.setPlaceholder("search reference..")
                    .onChange(( query: string ) => {
                        this.filter( query );
                        this.loadReferences();
                    })
                if (this.query !== "") cb.setValue(this.query);
                cb.inputEl.className = "reference-view-search";
                cb.inputEl.focus();
            })


    }

    loadReferences( view?: ItemView ) {

        const { contentEl } = view ? view : this;
        if (this.referenceContainer) {
            this.referenceContainer.empty();
        } else {
            this.referenceContainer = contentEl.createDiv();
            this.referenceContainer.style.maxHeight = "88%";
            this.referenceContainer.style.overflowY = "scroll";
        }

        for (let reference of this.filteredReferences) {

            new ReferenceCard( this, reference ).load()

        }
    }

    onunload() {
        this.contentEl.empty();
        super.onunload();
    }

}