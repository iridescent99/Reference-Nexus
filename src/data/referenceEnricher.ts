import {ButtonComponent, Component, Modal, Notice, Setting} from "obsidian";
import ReferenceNexus from "../index";
import {IMetric, IReference} from "../reference_nexus";
import {DivComponent} from "../utils/divComponent";
import {ElementComponent} from "../utils/elementComponent";

export enum EnrichMode {
    ADD="add",
    EDIT="edit"
}

export class ReferenceEnricher extends Modal {

    private reference: IReference;
    mode: EnrichMode = EnrichMode.ADD;
    metricContainer: DivComponent;
    currentMetric: IMetric;
    isCustom: boolean = false;
    EDIT_KEYS: string[] = ["title", "authors", "pageCount", "chapterCount", "image"];
    PLACEHOLDER_KEYS: string[] = ["id", "type"];
    plugin: ReferenceNexus;

    constructor( plugin: ReferenceNexus ) {
        super(plugin.app);
        this.plugin = plugin;
    }

    generateEditKeys() {
        if (this.reference.type === "article") return ["title", "authors", "pageCount", "platform", "url", "image"]
        if (this.reference.type === "video") return ["title", "authors", "platform", "url"];
        if (this.reference.type === "research paper") return ["title", "authors", "url", "pageCount"]
        if (this.reference.type !== "book") return [...this.EDIT_KEYS, "platform"];
        return this.EDIT_KEYS;
    }

    updateMode( mode: EnrichMode ) {
        this.mode = mode;
        return this;
    }

    setReference( reference: IReference ): ReferenceEnricher {

        this.reference = reference;
        this.currentMetric = reference.metrics[0];
        if (this.reference.id == "CUSTXX") this.isCustom = true;
        return this;

    }

    onOpen() {

        console.log(this.reference)
        const { contentEl } = this;
        new ElementComponent("h2", contentEl, { text: "Reference Enricher" })
        new ElementComponent("p",  contentEl,{ text: "Adjust the configurations for this reference and choose your preferred metrics." })
        new ElementComponent("br",  contentEl)
        this.createSettings()
            .createMetrics();

    }

    createSettings() {

        const { contentEl } = this;
        const container = new DivComponent(contentEl);

        for ( let [key, value] of Object.entries(this.reference)) {

            if (this.generateEditKeys().includes(key)) {
                new Setting(container.el)
                    .setName(key)
                    .addText((cb) => {
                        cb.setValue(
                            (["pageCount", "chapterCount"].includes(key)) ? value.toString() : key === "authors" ? value.join(", ") : value
                        )
                            .onChange((newVal) => {
                                this.reference.updateProperty( key, newVal );
                                this.plugin.referenceManager.updateReference(this.reference)
                            })
                    })
            } else if (this.PLACEHOLDER_KEYS.includes(key)) {
                new Setting(container.el)
                    .setName(key)
                    .addText((cb) => cb.setPlaceholder(value).setDisabled(true))

            }

        }

        container.createChild("br");
        return this;

    }

    createMetrics() {

        const { contentEl } = this;
        this.metricContainer = new DivComponent(contentEl);
        this.metricContainer.createChild("h3", { text: "Metrics" });

        Object.entries(this.currentMetric).forEach(([key, value]) => {

            if ( ["isBinary", "completed"].includes(key) ) {

                new Setting( this.metricContainer.el )
                    .setName(key)

                    .addToggle((cb) => {
                        cb.setValue(key === "isBinary" ? this.currentMetric.isBinary : this.currentMetric.completed)
                            .onChange((bl) => {
                            if (key === "isBinary") this.currentMetric.isBinary = bl;
                            else this.currentMetric.completed = bl;
                            this.reloadMetrics();
                            this.plugin.referenceManager.updateReference( this.reference );
                        })

                    })

            } else if (key === "color") {

                new Setting( this.metricContainer.el )
                    .setName(key)
                    .setDesc("The color that will be used for the progress bar.")
                    .addColorPicker((cb) => {
                        cb.onChange((newValue) => {
                            this.currentMetric.updateMetric(key, newValue);
                            this.plugin.referenceManager.updateReference( this.reference );
                        }).setValue(value)
                    })

            } else {
                if (!(this.currentMetric.isBinary && ["currentUnit", 'totalUnits', "unit"].includes(key))) {
                    new Setting( this.metricContainer.el )
                        .setName(key)
                        .setDesc(key === "unit" ? "The unit used to measure your progress." : "")
                        .addText((cb) => {
                            cb.setValue(
                                ["currentUnit", "totalUnits"].includes(key) ? (
                                    (this.currentMetric.unit === "chapter" && this.reference.chapterCount && this.reference.chapterCount != -1) ? this.reference.chapterCount.toString() : value.toString()) : value
                            )
                                .onChange((newValue) => {
                                    this.currentMetric.updateMetric(key, newValue);
                                    this.plugin.referenceManager.updateReference( this.reference );
                                })
                        })

                }


            }
        })


        const moveMetric =  this.metricContainer.createChild("div", { cls: "button-container-move-metric" } );

        const currentMetricIndex = this.reference.metrics.indexOf(this.currentMetric);

        const btnLeft = new ButtonComponent( moveMetric.el  )
            .setIcon('move-left')
            .onClick(() => {
                this.currentMetric = this.reference.metrics[ currentMetricIndex - 1 ];
                this.reloadMetrics();
            })
        if ( currentMetricIndex === 0 ) btnLeft.setDisabled(true);
        const btnRight = new ButtonComponent( moveMetric.el )
            .setIcon('move-right')
            .onClick(() => {
                this.currentMetric = this.reference.metrics[ currentMetricIndex + 1 ];
                this.reloadMetrics();
            })
        if ( currentMetricIndex === this.reference.metrics.length - 1 ) btnRight.setDisabled(true);

        const btnContainer = this.metricContainer.createChild("div", { cls: "button-container" } )
        new ButtonComponent( btnContainer.el )
            .setButtonText("add metric")
            .onClick((cb) => {
                this.reference.createMetric();
                this.currentMetric = this.reference.metrics[this.reference.metrics.length - 1];
                this.reloadMetrics();
            });
        new ButtonComponent( btnContainer.el )
            .setButtonText("delete metric")
            .onClick((cb) => {
                if (currentMetricIndex === 0 && this.reference.metrics.length === 1) new Notice("Please create another metric before deleting your only metric.")
                else {
                    this.reference.deleteMetric( this.currentMetric );
                    this.currentMetric = currentMetricIndex > 0 ? this.reference.metrics[ currentMetricIndex - 1  ] :
                        this.reference.metrics[ currentMetricIndex + 1 ];
                    this.reloadMetrics();
                }
            });
        new ButtonComponent( btnContainer.el )
            .setButtonText("save reference")
            .onClick((cb) => {
                if (this.mode === EnrichMode.ADD) {
                    if (this.isCustom) this.reference.id = this.plugin.tools.generateHash(`${this.reference.title.toLowerCase()}|custom`)
                    this.plugin.referenceManager.addReference( this.reference );
                }
                if (this.mode === EnrichMode.EDIT) this.plugin.referenceManager.updateReference( this.reference );
                this.close();
            });


        return this;

    }

    reloadMetrics() {
        this.metricContainer.el.empty();
        this.createMetrics();
    }

    onClose() {
        this.contentEl.empty();
    }

}