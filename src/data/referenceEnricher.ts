import {Component, Modal} from "obsidian";
import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ObsidianDiv} from "../utils/obsidianDiv";


export class ReferenceEnricher extends Modal {

    private callback: Function;
    private reference: IReference;
    private window: ObsidianDiv

    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
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
            .createContainer((div) => {
                div
                    .setHeading("Metrics", "h4")

                for ( let metric of this.reference.metrics ) {
                    div
                        .setHeading("Metric " + (this.reference.metrics.indexOf(metric) + 1).toString(), "h5")
                        .addMetric( this.reference, metric )
                }
                div.addButton("Add metric")
            })
    }

}