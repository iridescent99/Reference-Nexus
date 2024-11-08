import {Plugin, TFile, WorkspaceLeaf} from "obsidian";
import {IMetric, Settings} from "./reference_nexus";
import {NexusSettingsTab} from "./utils/settings";
import {ReferenceSearch} from "./search/referenceSearch";
import {ReferenceView,} from "./view/referenceView";
import {ReferenceManager} from "./data/referenceManager";
import "./styles.css";
import {DEFAULT_SETTINGS} from "./utils/defaultSettings";
import {ReferenceEnricher} from "./data/referenceEnricher";
import {ReferenceDashboard} from "./data/referenceDashboard";
import {Tools} from "./utils/tools";
export const VIEW_TYPE = "reference-nexus-view";

export default class ReferenceNexus extends Plugin {

    settings: Settings;
    referenceManager: ReferenceManager;
    referenceEnricher: ReferenceEnricher;
    referenceDashboard: ReferenceDashboard;
    referenceLeaf: WorkspaceLeaf;
    tools: Tools;
    scanTimeOut: number;

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

        this.tools = new Tools(this);
        this.referenceManager = new ReferenceManager(this);
        this.referenceEnricher = new ReferenceEnricher(this);
        this.referenceDashboard = new ReferenceDashboard(this)
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
            VIEW_TYPE,
            (leaf) => new ReferenceView(this, leaf)
        );

        this.addCommand({
            id: 'open-reference-view',
            name: 'Open Reference View',
            callback: () => {
                this.activateView();
            }
        });

        this.addRibbonIcon('library-big', 'reference view', async () => {
            await this.activateView();
        });

        const existingView = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        if (existingView.length > 0) {
            // If the view is already open, manually trigger rendering
            const view = existingView[0].view as ReferenceView;
            view.initialize();
        }

        this.app.workspace.on('quit', () => {
            this.referenceLeaf.detach()
        })

        this.app.vault.on('modify', (file: TFile) => {
            if (file.extension === "md") this.debounceScan(file);
        })



    }

    debounceScan( file: TFile ) {
        if (this.scanTimeOut) {
            clearTimeout(this.scanTimeOut);
        }

        this.scanTimeOut = window.setTimeout(() =>{
            this.referenceManager.scanForLinks();
        }, 5000)
    }


    async activateView() {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);

        // If the view is already open, just reveal it
        if (leaves.length > 0) {
            this.referenceLeaf = leaves[0]
            await this.app.workspace.revealLeaf(this.referenceLeaf);
        } else {
            // Otherwise, open a new one in the right pane
            await this.app.workspace.getRightLeaf(false)?.setViewState({
                type: VIEW_TYPE,
                active: true,
            });
            this.referenceLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]
            await this.app.workspace.revealLeaf(this.referenceLeaf);
        }
    }

    onunload() {
        // TODO: close leaf properly
        // this.closeView().then(() => this.unload())
    }

    async closeView() {
        await new Promise<void>((resolve) => {
            this.referenceLeaf.detach()
            resolve();
        });
    }


}


