import {IReference} from "../reference_nexus";
import {ReferenceView} from "./referenceView";
import {ButtonComponent, Component, Notice} from "obsidian";
import {EnrichMode} from "../data/referenceEnricher";
import {reference} from "@popperjs/core";


export class ReferenceCard extends Component {

    data: IReference;
    containerEl: HTMLElement
    buttons: ButtonComponent[] = [];
    view: ReferenceView;
    DISPLAY_KEYS: string[] = ["title", "authors", "type"];

    constructor( view: ReferenceView, reference: IReference ) {

        super();
        this.data = reference;
        this.view = view;
        this.containerEl = view.referenceContainer.createDiv()
        if (reference.type === "article") this.DISPLAY_KEYS = ["title", "platform", "type"];

        // this.data = reference;
        // view.contentEl.appendChild( this.container );

        return this;

    }

    onload() {
        // TODO: add tooltip on hover progress bars
        // TODO: linear gradient for progress color

        this.registerDomEvent(this.containerEl, 'dblclick', () => {
            this.view.plugin.referenceDashboard.setReference( this.data )
                .open();
        })
        this.containerEl.className = "reference-container";
        const btnContainer = this.containerEl.createDiv({cls: "reference-button-container"})
        this.buttons.push(new ButtonComponent(btnContainer)
            // TODO: imrpove click surface 
            .setIcon('cross')
            .setClass("close-button")
            .onClick(() => {
                this.view.plugin.referenceManager.removeReference( this.data );
            }));
        this.buttons.push(new ButtonComponent(btnContainer)
            // TODO: imrpove click surface
            .setIcon('pencil')
            .setClass("edit-button")
            .onClick(() => {
                this.view.plugin.referenceEnricher
                    .updateMode( EnrichMode.EDIT )
                    .setReference( this.data )
                    .open();
            }));
        this.buttons.forEach((button: ButtonComponent) => button.buttonEl.style.display = "none");

        this.registerDomEvent(this.containerEl, 'mouseenter', () => {
            this.enableButtons()
        })
        this.registerDomEvent(this.containerEl, 'mouseleave', () => {
            this.disableButtons()
        }, {});
        this.registerDomEvent(this.containerEl, 'contextmenu', () => {
            this.copyId()
        }, {});

        this.loadContent();
        if (this.view.plugin.settings.showProgressInView) this.loadMetrics();

    }

    copyId() {
        try {
            navigator.clipboard.writeText(this.data.id).then(() => new Notice("Id copied to clipboard"));
        } catch (e) {
            new Notice("Failed to copy id to clipboard.");
            console.error(e)
        }
    }

    loadContent() {
        const contentContainer = this.containerEl.createDiv({cls: "content-container"})
        for ( let [key, value] of Object.entries(this.data)) {
            if (this.DISPLAY_KEYS.includes(key)) {
                contentContainer.createDiv( { cls: `reference-${key}` } ).textContent = typeof value === "string" ? value : value.join(", ");
            }
        }
        if (this.data.image) {
            const img = this.containerEl.createEl("img", { cls: "reference-image" });
            img.src = this.data.image;
        } else {
            contentContainer.style.gridRow = "1/2";
        }
    }

    loadMetrics() {

        const metricContainer = this.containerEl.createDiv( { cls: "view-metric-container" } );
        for ( let metric of this.data.metrics ) {
            const metricDiv = metricContainer.createDiv( { cls: "metric-div" } );
            const progressBar = metricDiv.createDiv( { cls: "view-progress-bar" } );
            const progress = metric.calculateProgress()
            const progressDiv = progressBar.createDiv( { cls: "progress" } )
            progressDiv.style.width = `${progress}%`;
            if (progress > 95) {
                progressDiv.style.borderBottomRightRadius = "15px";
                progressDiv.style.borderTopRightRadius = "15px";
            }
            progressDiv.style.background = metric.color;
        }

    }

    enableButtons() {
        this.buttons.forEach((button: ButtonComponent) => button.buttonEl.style.display = "block");
    }

    disableButtons() {
        this.buttons.forEach((button: ButtonComponent) => button.buttonEl.style.display = "none");
    }

    onunload() {
        this.containerEl.empty()
    }


}