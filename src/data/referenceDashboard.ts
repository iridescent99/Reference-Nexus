import {Component, Modal, Setting} from "obsidian";
import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {DivComponent} from "../utils/divComponent";
import {ProgressBar} from "../utils/progressBar";
import {ElementComponent} from "../utils/elementComponent";


export class ReferenceDashboard extends Modal{

    plugin: ReferenceNexus;
    reference: IReference;
    metricsDiv: DivComponent;

    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onOpen() {

        const { contentEl } = this;
        new ElementComponent("h2", contentEl, { text: this.reference.title, cls: "reference-title" });
        this.metricsDiv = new DivComponent(contentEl, { cls: "dashboard-metrics-container" } )
        new ElementComponent("p", contentEl, { cls: "dashboard-authors", text: this.reference.authors.join(", ") })
        new ElementComponent("br", contentEl);
        this.loadMetrics()
        super.onOpen();
    }

    loadMetrics() {

        const { contentEl } = this;

        for ( let metric of this.reference.metrics ) {
            const metricDiv = new DivComponent(contentEl, { cls: "metric-div" } );
            const progressDiv = new ProgressBar( metricDiv.el, metric, "dashboard" );

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