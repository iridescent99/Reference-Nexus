import {SuggestModal} from "obsidian";
import ReferenceNexus from "../index";

export enum ReferenceType {
    BOOK="book",
    ARTICLE="article",
    RESEARCH_PAPER="research paper",
    COURSE="course",
    VIDEO="video",
}

export class ReferenceTypePicker extends SuggestModal<ReferenceType> {

    plugin: ReferenceNexus;
    callback: Function;

    constructor( plugin: ReferenceNexus, callback: Function) {
        super(plugin.app);
        this.plugin = plugin;
        this.callback = callback;
    }

    getSuggestions(query: string): ReferenceType[] | Promise<ReferenceType[]> {
        return Object.values(ReferenceType);
    }

    renderSuggestion(value: ReferenceType, el: HTMLElement) {
        el.createDiv({ text: value })
    }

    onChooseSuggestion(item: ReferenceType, evt: MouseEvent | KeyboardEvent) {
        this.callback( item );
    }
}