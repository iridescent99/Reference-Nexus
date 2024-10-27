import {ButtonComponent, IconName, ItemView, setIcon, Setting, WorkspaceLeaf} from "obsidian";
import ReferenceNexus, {VIEW_TYPE} from "../index";
import {ReferenceCard} from "./referenceCard";
import {IReference} from "../reference_nexus";
import {DivComponent} from "../utils/divComponent";

export class ReferenceView extends ItemView {

    plugin: ReferenceNexus;
    filteredReferences: IReference[] = [];
    referenceContainer: DivComponent;
    container: DivComponent;
    themeChoiceContainer: DivComponent;
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

    getIcon(): IconName {
        return "library-big";
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    filter( query: string ) {
        if (query === "") this.filteredReferences = this.plugin.referenceManager.references;
        this.filteredReferences = this.filteredReferences.filter((reference: IReference) => {
            return Object.values(reference).filter((val: any) => {
                    if (typeof val === "string" && (val.toLowerCase().includes(query.toLowerCase()) || val.toLowerCase() === query.toLowerCase())) return true;
                    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string" && val.map((el: string) => el.toLowerCase()).join("|").includes(query.toLowerCase())) return true;
                }
            ).length > 0;
        })
    }

    initialize() {

        this.loadComponents();
        this.loadReferences();
    }



// TODO: search based on status
    protected async onOpen(): Promise<void> {
        this.initialize()
    }

    loadComponents() {

        const { contentEl } = this;
        contentEl.empty();
        this.container = new DivComponent(contentEl, {cls:"reference-view-container"});

        const header = this.container.createChild("div", {cls: "reference-view-header"}) as DivComponent;
        header.createChild("h2", { text: "Reference view" });

        new Setting(header.el)
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
            this.referenceContainer.el.empty();
        } else {
            this.referenceContainer = this.container.createChild("div", {cls: "reference-scroll"}) as DivComponent;

        }

        for (let reference of this.filteredReferences) {

            new ReferenceCard( this, reference ).load()

        }
    }

    toggleThemeOptions() {
        this.themeChoiceContainer.setStyle({
            display: this.themeChoiceContainer.el.style.display === "none" ? "flex" : "none"
        })
    }



    onunload() {
        const { contentEl } = this;

        contentEl.empty();
        this.contentEl.empty();
        this.containerEl.empty()
    }

    protected onClose(): Promise<void> {
        this.containerEl.empty();
        return super.onClose();
    }

}