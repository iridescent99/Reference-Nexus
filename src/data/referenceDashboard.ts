import {Component, Modal, Setting} from "obsidian";
import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {DivComponent} from "../utils/divComponent";
import {ProgressBar} from "../utils/progressBar";
import {ElementComponent} from "../utils/elementComponent";
import {DashboardMetric} from "../utils/dashboardMetric";


export class ReferenceDashboard extends Modal{

    plugin: ReferenceNexus;
    reference: IReference;
    progressContainer: DivComponent;
    header: DivComponent;
    imageContainer: DivComponent;


    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onOpen() {

        const { contentEl } = this;
        contentEl.classList.add("dashboard-container");

        this.header = new DivComponent(contentEl, { cls: "reference-dashboard-header" })
        this.header.createChild("h2", { text: this.reference.title, cls: "reference-title" })
        this.header.createChild("p",{ cls: "reference-authors", text: this.reference.authors.join(", ") })


        this.progressContainer = new DivComponent(contentEl, { cls: "dashboard-progress-container" } );
        if (this.reference.image) {
            this.imageContainer = new DivComponent(contentEl, { cls: "dashboard-image-container" });
            this.imageContainer.createChild("img", { cls: "dashboard-image"}).el.src = this.reference.image;


        }

        new ElementComponent("br", contentEl);
        this.loadMetrics()
        super.onOpen();
    }

    loadMetrics() {

        const { contentEl } = this;

        for ( let metric of this.reference.metrics ) {

            this.progressContainer.addChild(new DashboardMetric(this.progressContainer.el, metric, {}, "reference-dashboard" ))

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