import {Plugin, WorkspaceLeaf} from "obsidian";
import {Metric, Settings} from "./reference_nexus";
import {NexusSettingsTab} from "./utils/settings";
import {ReferenceSearch} from "./search/referenceSearch";
import {ReferenceView, VIEW_TYPE_CUSTOM} from "./view/referenceView";
import {ReferenceManager} from "./data/referenceManager";
import "./styles.css";
import {DEFAULT_SETTINGS} from "./utils/defaultSettings";
import {ReferenceDiv} from "./view/referenceDiv";
import {MetricDiv} from "./view/metricDiv";
import {ReferencePropertyDiv} from "./view/referencePropertyDiv";
import {ReferenceMetric} from "./view/metric";
import {Tooltip} from "./view/tooltip";


export default class ReferenceNexus extends Plugin {

    settings: Settings;
    referenceManager: ReferenceManager;

    async onload() {

        console.log(`Loading ${this.manifest.name} (${this.manifest.version})`);

        await this.loadSettings();
        this.app.workspace.onLayoutReady(() => this.initialize());

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

    initialize() {

        this.referenceManager = new ReferenceManager(this);
        this.referenceManager.loadReferences();

        this.addSettingTab(new NexusSettingsTab(this.app, this));

        this.addCommand({
            id: 'add-reference',
            name: 'Add reference',
            callback: () => {
                new ReferenceSearch(this).start();
            },
        });

        this.registerView(
            'reference-view',
            (leaf) => new ReferenceView(this, leaf)
        );

        this.addCommand({
            id: 'open-reference-view',
            name: 'Open Reference View',
            callback: () => {
                this.activateView();
            }
        });

        this.addRibbonIcon('book', 'reference view', async () => {
            await this.activateView();
            console.log(this.app.workspace.getRightLeaf(false))
        });

        customElements.define('reference-div', ReferenceDiv, {extends: "div"});
        customElements.define('metric-div', MetricDiv, {extends: "div"});
        customElements.define('reference-metric', ReferenceMetric, {extends: "div"});
        customElements.define('reference-property-div', ReferencePropertyDiv, {extends: "div"});
        customElements.define('tooltip-div', Tooltip, {extends: "div"});

    }


    async activateView() {
        // TODO: FIX Opening two leafs now
        this.app.workspace.detachLeavesOfType('reference-view');

        let leaf: WorkspaceLeaf|undefined|null = this.app.workspace.getLeavesOfType('reference-view').first()
        if (!leaf) leaf = this.app.workspace.getRightLeaf(false);
        // @ts-ignore
        await leaf.setViewState({
            type: 'reference-view',
            active: true,
        });

        if (leaf) await this.app.workspace.revealLeaf(
            leaf
        );

    }



    onunload() {
        // TODO: close leaf properly
        this.app.workspace.detachLeavesOfType('reference-view');
    }

}


