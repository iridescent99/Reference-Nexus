import {IReference} from "../reference_nexus";
import {ReferenceView} from "./referenceView";
import {ButtonComponent, Component} from "obsidian";
import {EnrichMode} from "../data/referenceEnricher";


export class ReferenceCard extends Component {

    data: IReference;
    containerEl: HTMLElement
    button: ButtonComponent;
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
            this.view.plugin.referenceEnricher
                .updateMode( EnrichMode.EDIT )
                .setReference( this.data )
                .open();
        })
        this.containerEl.className = "reference-container";
        this.button = new ButtonComponent(this.containerEl)
            // TODO: imrpove click surface 
            .setIcon('cross')
            .setClass("close-button")
            .onClick(() => {
                this.view.plugin.referenceManager.removeReference( this.data );
            });
        this.button.buttonEl.style.display = "none";

        this.registerDomEvent(this.containerEl, 'mouseenter', () => {
            this.enableCloseButton()
        })
        this.registerDomEvent(this.containerEl, 'mouseleave', () => {
            this.disableCloseButton()
        }, {});

        this.loadContent();
        this.loadMetrics();

    }

    loadContent() {
        for ( let [key, value] of Object.entries(this.data)) {
            if (this.DISPLAY_KEYS.includes(key)) {
                this.containerEl.createDiv( { cls: `reference-${key}` } ).textContent = typeof value === "string" ? value : value.join(", ");
            }
        }
        console.log(this.data)
        if (this.data.image) {
            const img = this.containerEl.createEl("img", { cls: "reference-image" });
            img.src = this.data.image;
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

    enableCloseButton() {
        this.button.buttonEl.style.display = "block";
    }

    disableCloseButton() {
        this.button.buttonEl.style.display = "none";
    }

    onunload() {
        this.containerEl.empty()
    }


}