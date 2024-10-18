import {PluginSettingTab, App, Setting} from "obsidian";
import ReferenceNexus from "./index";
import {ReferenceType} from "./search/typePicker";

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
            new Setting(metricsDiv)
                .setName(type)
                .setHeading()
                .addText((cb) => cb.setPlaceholder("property e.g. reading, summarizing"))
                .addText((cb) => cb.setPlaceholder("unit, e.g. chapter, page"))
        }

        this.configContainer.createEl('h3', {text:'API Keys'});
        const apiDiv = this.configContainer.createDiv({text: "API Keys for finding matching reference types."});

        for (let [key, value] of Object.entries(this.plugin.settings.apiKeys)) {
            new Setting(apiDiv)
                .setName(key)
                .setHeading()
                .addText((cb) => cb.setPlaceholder(value))
        }



    }

    addTextField(containerEl: HTMLElement, reference: string, value='') {
        const wrapper = containerEl.createDiv()
        containerEl.insertBefore(wrapper, containerEl.children[containerEl.children.length-1])
        const textInput = wrapper.createEl('input');
        textInput.type = 'text';
        textInput.value = value;
        textInput.className = reference;

        const removeButton = wrapper.createEl('button', {
            text: 'Remove'
        })
        removeButton.addEventListener('click', () => {
            wrapper.remove();
            const textValues = Array.from(containerEl.querySelectorAll(`.${reference}`)).map((el: HTMLInputElement) => el.value);
            // @ts-ignore
            this.plugin.settings[reference] = textValues;
            this.plugin.saveSettings()
        });

        textInput.addEventListener('input', () => {
            this.saveMultipleTextValues(containerEl, reference)
        })
    }

    saveMultipleTextValues(containerEl: HTMLElement, reference: string) {
        // @ts-ignore
        const textValues = Array.from(containerEl.querySelectorAll(`.${reference}`)).map((el: HTMLInputElement) => el.value);
        // @ts-ignore
        this.plugin.settings[reference] = textValues;
        this.plugin.saveSettings();
    }
}