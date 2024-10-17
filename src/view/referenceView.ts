import {ItemView} from "obsidian";
import ReferenceNexus from "../index";

export class ReferenceView extends ItemView {


    constructor( plugin: ReferenceNexus ) {
        super();
    }

    getDisplayText(): string {
        return "";
    }


}