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
        if (!(query.length > 0)) return Object.values(ReferenceType);
        return Object.values(ReferenceType).filter((type: ReferenceType) => type.contains(query.toLowerCase()));
    }

    renderSuggestion(value: ReferenceType, el: HTMLElement) {
        el.createDiv({ text: value })
    }

    onChooseSuggestion(item: ReferenceType, evt: MouseEvent | KeyboardEvent) {
        this.callback( item );
    }
}