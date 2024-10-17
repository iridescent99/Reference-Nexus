import {
    ButtonComponent,
    Modal,
    Setting,
    Instruction,
    TextComponent,
    Notice,
    FuzzySuggestModal,
    FuzzyMatch,
    SuggestModal
} from 'obsidian';
import ReferenceNexus from "../index";
import {Reference} from "../reference_nexus";
import {ReferenceTypePicker} from "./typePicker";
import {ReferenceType} from "./typePicker";
import {getBooks} from "../api/googleBooks";
import {Connector} from "../api/connector";

export class ReferenceSearch extends FuzzySuggestModal<Reference> {
    private isBusy = false;
    private okBtnRef?: ButtonComponent;
    private typePicker: ReferenceTypePicker;
    private referenceType: ReferenceType;
    private searchButton: HTMLButtonElement;
    private callback: Function;
    private results: any[] = [];
    private connector: Connector;

    constructor( private plugin: ReferenceNexus ) {

        super(plugin.app);

        this.connector = new Connector(this);

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.initiateSearch()
            }
        }, {capture: true});

        this.insertSearchButton();

        this.typePicker = new ReferenceTypePicker(plugin, ( type: ReferenceType ) => this.setReferenceType( type ));

    }

    public start() {
        this.typePicker.open();
    }

    private insertSearchButton() {

        const promptContainer = this.containerEl.getElementsByClassName("prompt-input-container")[0];

        const clearButton = this.containerEl.getElementsByClassName("search-input-clear-button")[0];

        this.searchButton = this.contentEl.createEl("button", { text: "search" });
        this.searchButton.style.marginRight = "4em";
        this.searchButton.style.marginTop = ".8em";
        this.searchButton.addEventListener('click', (e) => this.initiateSearch())

        promptContainer.insertBefore(
            this.containerEl.createDiv().appendChild(this.searchButton),
            clearButton
        );

    }

    private initiateSearch() {

        this.isBusy = true;
        this.searchButton.disabled = true;
        this.searchButton.textContent = "searching..";
        // TODO: check for content
        if (this.referenceType === "book") this.connector.getBooks(this.inputEl.value || "");
        if (this.referenceType === "article") this.connector.getArticles(this.inputEl.value || "");
        if (this.referenceType === "research paper") this.connector.getResearchPapers(this.inputEl.value || "");
    }

    setResults( results: any[] ) {

        this.results = results;
        this.isBusy = false;
        this.searchButton.disabled = false;
        this.searchButton.textContent = "search";
        this.inputEl.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: false
        }))

    }

    public setReferenceType( type: ReferenceType ) {

        this.referenceType = type;
        this.open();

    }

    getItems(): Reference[] {
        return this.results;
    }

    getSuggestions(query: string): FuzzyMatch<Reference>[] {
        console.log(this.results)
        if (!query || this.results.length === 0) return [];
        return this.results.map((reference: Reference, i: number) => {
            return {
                item: reference,
                match: {
                    matches: [[0,0]],
                    score: i+1
                }
            }
        })
        // TODO: include option
    }

    renderSuggestion(item: FuzzyMatch<Reference>, el: HTMLElement) {
        const container = el.createDiv()
            container.createDiv({text: item.item.title});
            container.createDiv({text: item.item.authors.join(", ")})
    }

    onNoSuggestion() {
        return [];
    }

    onChooseItem(item: Reference, evt: MouseEvent | KeyboardEvent) {

    }

    getItemText(item: Reference): string {
        return item.title;
    }

    onClose() {
        this.contentEl.empty();
    }
}