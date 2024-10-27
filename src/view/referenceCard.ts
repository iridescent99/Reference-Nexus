import {IReference, StyleSettings} from "../reference_nexus";
import {ReferenceView} from "./referenceView";
import {ButtonComponent, Component, Notice} from "obsidian";
import {EnrichMode} from "../data/referenceEnricher";
import {reference} from "@popperjs/core";
import {DivComponent} from "../utils/divComponent";


export class ReferenceCard extends Component {

    data: IReference;
    containerEl: DivComponent
    buttons: ButtonComponent[] = [];
    view: ReferenceView;
    DISPLAY_KEYS: string[] = ["title", "authors", "type"];

    constructor( view: ReferenceView, reference: IReference ) {

        super();
        this.data = reference;
        this.view = view;
        this.containerEl = new DivComponent(view.referenceContainer.el)
        if (reference.type === "article") this.DISPLAY_KEYS = ["title", "platform", "type"];

        // this.data = reference;
        // view.contentEl.appendChild( this.container );

        return this;

    }

    onload() {
        // TODO: add tooltip on hover progress bars
        // TODO: linear gradient for progress color

        this.containerEl.on('dblclick', () => {
            this.view.plugin.referenceDashboard.setReference( this.data )
                .open();
        })
        this.containerEl.setClass("reference-container");
        const btnContainer = this.containerEl.createChild("div", {cls: "reference-button-container"})
        this.buttons.push(new ButtonComponent(btnContainer.el)
            // TODO: imrpove click surface 
            .setIcon('cross')
            .setClass("close-button")
            .onClick(() => {
                this.view.plugin.referenceManager.removeReference( this.data );
            }));
        this.buttons.push(new ButtonComponent(btnContainer.el)
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

        this.containerEl.on('mouseenter', () => {
            this.enableButtons()
        })
        this.containerEl.on( 'mouseleave', () => {
            this.disableButtons()
        });
        this.containerEl.on( 'contextmenu', () => {
            this.copyId()
        });

        this.loadContent();
        if (this.view.plugin.settings.showProgressInView) this.loadMetrics();

    }

    copyId() {
        try {
            navigator.clipboard.writeText(this.data.id).then(() => new Notice("id copied to clipboard"));
        } catch (e) {
            new Notice("Failed to copy id to clipboard.");
            console.error(e)
        }
    }

    loadContent() {
        const contentContainer = this.containerEl.createChild("div", {cls: "content-container"}) as DivComponent;
        for ( let [key, value] of Object.entries(this.data)) {
            if (this.DISPLAY_KEYS.includes(key)) {
                contentContainer.createChild("div", { cls: `reference-${key} ${key === "type" && `${value}`}` } )
                    .setText(typeof value === "string" ? value : value.join(", "))
            }
        }
        if (this.data.image) {
            // const img = contentContainer.createChild("img", { cls: "reference-image" });
            // img.el.src = this.data.image;
        } else {
            contentContainer.setStyle({
                gridRow: "1/2"
            });
        }
    }

    loadMetrics() {

        const metricContainer = this.containerEl.createChild("div", { cls: "view-metric-container" } ) as DivComponent;
        for ( let metric of this.data.metrics ) {
            const metricDiv = metricContainer.createChild("div", { cls: "metric-div" } ) as DivComponent;
            const progressBar = metricDiv.createChild("div", { cls: "view-progress-bar" } ) as DivComponent;
            const progress = metric.calculateProgress()
            const progressDiv = progressBar.createChild("div", { cls: "progress" } );

            let style: StyleSettings = {
                width: `${progress}%`,
                background: metric.color
            }
            if (progress > 95) {
                style = {
                    ...style,
                    borderBottomRightRadius: "15px",
                    borderTopRightRadius: "15px"
                }
            }
            progressDiv.setStyle(style);
        }

    }

    enableButtons() {
        this.buttons.forEach((button: ButtonComponent) => button.buttonEl.style.display = "block");
    }

    disableButtons() {
        this.buttons.forEach((button: ButtonComponent) => button.buttonEl.style.display = "none");
    }

    onunload() {
        this.containerEl.el.empty()
    }


}