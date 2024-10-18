import {PluginSettingTab, App, Setting} from "obsidian";
import ReferenceNexus from "../index";
import {ReferenceType} from "../search/typePicker";

export class NexusSettingsTab extends PluginSettingTab {

    plugin: ReferenceNexus;
    configContainer: HTMLElement;

    constructor(app: App, plugin: ReferenceNexus) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl('h1', {text:'Reference Nexus'});
        this.configContainer = this.containerEl.createDiv({cls: "list-config-container"});
        this.configContainer.createEl('h3', {text:'Metrics'})
        const metricsDiv = this.configContainer.createDiv({text: "Choose metrics for evaluating progress per reference type."});
        metricsDiv.appendChild(this.containerEl.createEl("br"));

        for (let type of Object.values(ReferenceType)) {
            const metricSetting = new Setting(metricsDiv);
            metricSetting
                .setName(type)
                .setHeading()
            for (let metric of this.plugin.settings.metrics[type]) {
                metricSetting
                    .addText((cb) => cb.setPlaceholder(metric.name))
                    .addText((cb) => cb.setPlaceholder(metric.unit))
            }
        }

        this.configContainer.createEl('h3', {text:'API Keys'});
        const apiDiv = this.configContainer.createDiv({text: "API Keys for finding matching reference types."});

        for (let [key, value] of Object.entries(this.plugin.settings.apiKeys)) {
            console.log(value)
            new Setting(apiDiv)
                .setName(key)
                .setDesc(`Register for an API key at ${value.url}`)
                .addText((cb) => {
                    cb.setPlaceholder(value.key)
                        .onChange((newKey: string) => this.setAPIKey(key, newKey))
                })
        }

    // TODO: on change settings location move all files to new loc
        this.configContainer.createEl('h3', {text:'Paths'});
        const locDiv = this.configContainer.createDiv({text: "Locations for storing references."});
        new Setting(locDiv)
            .setDesc("Folder to save reference data to.")
            .addText((cb) => cb.setPlaceholder(this.plugin.settings.referencesLocation).onChange((newPath: string) => {
                this.plugin.settings.referencesLocation = newPath;
                this.plugin.saveSettings();
            }))

    }

    setAPIKey( name: string, key: string ) {
        this.plugin.settings.apiKeys[name].key = key;
        this.plugin.saveSettings();
    }

}