import {Component, Modal} from "obsidian";
import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ObsidianDiv} from "../utils/obsidianDiv";


export class ReferenceEnricher extends Modal {

    private callback: Function = () => {};
    private reference: IReference;
    private window: ObsidianDiv
    plugin: ReferenceNexus;

    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
        this.plugin = plugin;
        Object.setPrototypeOf(this.containerEl.children[1], ObsidianDiv.prototype)
        this.window = this.containerEl.children[1] as ObsidianDiv;
    }

    setCallback( fn: Function ): ReferenceEnricher {
        this.callback = fn;
        return this;
    }

    setReference( reference: IReference ): ReferenceEnricher {
        this.reference = reference;
        return this;
    }

    onOpen() {
        this.window
            .setStyle({
                // background: "pink"
            })
            .setTitle("Reference Enricher")
        this.setUpReferenceConfig();
        this.setUpMetricConfig();
    }

    setUpReferenceConfig( ) {
        this.window
            .createContainer((div) => {
                div
                    .setHeading(this.reference.title, "h3")
                    .addParagraph("Adjust the configurations for this reference and choose your preferred metrics.")
                    .addSetting((setting) => {
                        setting.setName("title")
                            .addText((cb) => cb.setValue(this.reference.title))
                    })
                    .addSetting((setting) => {
                        setting
                            .setName("authors")
                            .addText((cb) => cb.setValue(this.reference.authors.join(", ")))
                    })
                    .addSetting((setting) => {
                        setting
                            .setName("page count")
                            .addText((cb) => cb.setValue(this.reference.pageCount?.toString() || ""))
                    })
                if (this.reference.type === "book") {
                    div
                        .addSetting((setting) => {
                            setting
                                .setName("chapter count")
                                .addText((cb) => cb.setValue(this.reference.chapterCount?.toString() || ""))
                        })
                        .addLine()
                }
            })
    }

    setUpMetricConfig( ) {
        this.window
            .createContainer((outsideDiv) => {
                outsideDiv
                    .setHeading("Metrics", "h4")
                    .createContainer((innerDiv) => {
                        innerDiv
                            .setStyle({
                                overflowY: "scroll",
                                maxHeight: "20em"
                            })
                        for ( let metric of this.reference.metrics ) {
                            innerDiv
                                .setHeading("Metric " + (this.reference.metrics.indexOf(metric) + 1).toString(), "h5")
                                .addMetric( this.reference, metric )
                        }
                    })
                    .addButton((btn) => {
                        btn.textContent = "Add metric";
                        // TODO: Custom button for removing event listener
                        btn.addEventListener('click', () => {
                            this.reference.createMetric();
                            this.window.removeChild(outsideDiv);
                            this.setUpMetricConfig();
                        })
                    })
                    .addButton((btn) => {
                    btn.textContent =  "Save reference";
                    btn.addEventListener('click', () => this.callback( this.plugin, this.reference ))
                })
            })
    }


    onClose() {
        this.containerEl.empty();
        this.callback = () => {};
    }

}