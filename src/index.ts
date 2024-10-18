import {Plugin} from "obsidian";
import {Metric, Settings} from "./reference_nexus";
import {NexusSettingsTab} from "./settings";
import {ReferenceSearch} from "./search/referenceSearch";

export const DEFAULT_SETTINGS: Settings = {
    metrics: [],
    apiKeys: {
        googleBooks: "",
        newsApi: ""
    }
}

export default class ReferenceNexus extends Plugin {

    settings: Settings;

    async onload() {

        console.log(`Loading ${this.manifest.name} (${this.manifest.version})`);

        await this.loadSettings();
        this.initialize();

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

    initialize() {

        this.addSettingTab(new NexusSettingsTab(this.app, this));

        this.addCommand({
            id: 'add-reference',
            name: 'Add reference',
            callback: () => {
                new ReferenceSearch(this).start();
            },
        })

    }

    onunload() {}

}


