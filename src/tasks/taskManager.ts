import ReferenceNexus from "../index";
import {ReferenceType} from "../search/typePicker";


export class TaskManager {

    plugin: ReferenceNexus

    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
    }

    getTaskFile( referenceType: ReferenceType ) {
         return this.plugin.app.vault.getFileByPath(
             this.plugin.settings.referencesLocation + "/" + referenceType + "_todos.md"
         );
    }
}