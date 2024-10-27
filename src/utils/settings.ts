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
// TODO: show image in reference view setting
    // TODO: api key for diffbot
    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl('h1', {text:'Reference Nexus'});
        this.configContainer = this.containerEl.createDiv({cls: "list-config-container"});
        this.configContainer.createEl('h3', {text:'Default metrics'})

        for (let type of Object.values(ReferenceType)) {
            const metricSetting = new Setting(this.configContainer);
            metricSetting
                .setName(type)
            for (let metric of this.plugin.settings.metrics[type]) {
                metricSetting
                    .addText((cb) => cb.setValue(metric.name))
                    .addText((cb) => cb.setValue(metric.unit))
            }
        }

        this.configContainer.createEl('h3', {text:'API Keys'});

        for (let [key, value] of Object.entries(this.plugin.settings.apiKeys)) {
            new Setting(this.configContainer)
                .setName(key)
                .setDesc(`Register for an API key at ${value.url}`)
                .addText((cb) => {
                    cb.setValue(value.key)
                        .onChange((newKey: string) => this.setAPIKey(key, newKey))
                })
        }

    // TODO: on change settings location move all files to new loc
        this.configContainer.createEl('h3', {text:'Paths'});
        new Setting(this.configContainer)
            .setDesc("Folder to save reference data to.")
            .addText((cb) => cb.setValue(this.plugin.settings.referencesLocation).onChange((newPath: string) => {
                this.plugin.settings.referencesLocation = newPath;
                this.plugin.saveSettings();
            }))


        this.configContainer.createEl('h3', {text:'Graph'});
        new Setting(this.configContainer)
            .setDesc("Activate if you want your references to appear in Obsidian's graph view.")
            .addToggle((cb) => cb.setValue(this.plugin.settings.appearInGraphView)
                .onChange((newValue: boolean) => {
                this.plugin.settings.appearInGraphView = newValue;
                this.plugin.saveSettings();
            }));

        this.configContainer.createEl('h3', {text:'View'});
        new Setting(this.configContainer)
            .setDesc("Activate if you want the progress bars to be visible in your reference view.")
            .addToggle((cb) => cb.setValue(this.plugin.settings.showProgressInView)
                .onChange((newValue: boolean) => {
                    this.plugin.settings.showProgressInView = newValue;
                    this.plugin.saveSettings();
                    // TODO: reload view
                }))

        this.configContainer.createEl('h3', {text:'Property'});
        new Setting(this.configContainer)
            .setDesc("This value will be used as the property key for identifying links to a reference.")
            .addText((cb) => cb.setValue(this.plugin.settings.identifier)
                .onChange((newValue: string) => {
                    this.plugin.settings.identifier = newValue;
                    this.plugin.saveSettings();
                    // TODO: reload view
                }))


    }

    setAPIKey( name: string, key: string ) {
        this.plugin.settings.apiKeys[name].key = key;
        this.plugin.saveSettings();
    }

}