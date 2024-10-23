import {Component, Modal, Setting} from "obsidian";
import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {DivComponent} from "../utils/divComponent";
import {ProgressBar} from "../utils/progressBar";


export class ReferenceDashboard extends Modal{

    plugin: ReferenceNexus;
    reference: IReference;
    metricsDiv: HTMLElement;

    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onOpen() {

        const { contentEl } = this;
        contentEl.createEl("h2", { text: this.reference.title, cls: "reference-title" });
        this.metricsDiv = contentEl.createDiv( { cls: "dashboard-metrics-container" } )
        contentEl.createEl("p", { cls: "dashboard-authors", text: this.reference.authors.join(", ") })
        contentEl.createEl("br")
        this.loadMetrics()
        super.onOpen();
    }

    loadMetrics() {

        const { contentEl } = this;

        for ( let metric of this.reference.metrics ) {
            const metricDiv = contentEl.createDiv( { cls: "metric-div" } );
            const progressDiv = new ProgressBar( metricDiv, metric, "dashboard" );

        }

    }


    setReference( reference: IReference ): ReferenceDashboard {

        this.reference = reference;
        return this;

    }

    onClose() {

        const { contentEl } = this;
        contentEl.empty();
        super.onClose();

    }

}