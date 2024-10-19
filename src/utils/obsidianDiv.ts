import {IMetric, IReference, StyleSettings} from "../reference_nexus";
import {Setting} from "obsidian";

const CSS_PROPERTIES = Object.keys(document.body.style);

export class ObsidianDiv extends HTMLDivElement {

    container: any;

    constructor( parentEl: HTMLElement ) {
        super();
        parentEl.appendChild(this);
    }

    setStyle( styleSettings: StyleSettings ): ObsidianDiv {
        for ( let [name, value] of Object.entries(styleSettings) ) {
            if (CSS_PROPERTIES.includes(name)) { // @ts-ignore
                this.style[name] = value;
            }
        }
        return this;
    }

    setTitle( title: string ) {
        if (this.hasChildNodes()) {
            this.insertBefore(this.createEl("h2", {text: title}), this.childNodes[0]);
        } else {
            this.createEl("h2", { text: title })
        }
        return this;
    }

    createContainer( fn: (div: ObsidianDiv) => ObsidianDiv|void ) {
        const obsidianDiv = new ObsidianDiv(this);
        fn(obsidianDiv)
        return this;
    }

    setHeading( heading: string, tag: keyof HTMLElementTagNameMap ) {
        this.createEl(tag, { text: heading });
        return this;
    }

    addParagraph( text: string ) {
        this.createEl("p", { text: text });
        return this;
    }

    addSetting( fn: ( setting: Setting ) => Setting|void ) {
        const setting = new Setting(this);
        fn(setting);
        return this;
    }

    addLineBreak( count: number = 1 ) {
        for ( let i = 0; i < count; i++ ) {
            this.appendChild(this.createEl("br"))
        }
        return this;
    }

    // Make into button element that is customisabel
    addButton( fn: (btn: HTMLButtonElement) => any ) {
        const btn = this.createEl("button");
        fn(btn);
        this.appendChild(btn);
        return this;
    }

    addLine(  ) {
        this.appendChild(this.createEl("hr"));
        return this;
    }

    addMetric( reference: IReference, metric: IMetric ) {
        const container = new ObsidianDiv( this );
        container
            .addSetting((setting => {
            setting.setName("name")
                .addText((cb) => {
                    cb.setValue(metric.name)
                        .onChange((val: string) => {
                            metric.setName(val)
                        })
                })
        }))
            .addSetting((setting => {
                setting.setName("unit")
                    .addText((cb) => {
                        cb.setValue(metric?.unit || "")
                            .onChange((val: string) => metric.setUnit(val))
                    })
            }))
            .addSetting((setting => {
                setting.setName("total units")
                    .addText((cb) => {
                        cb.setValue((metric.name.includes("read") && reference.unit === "chapter" && reference.pageCount?.toString()) || metric.totalUnits?.toString() || "-1")
                            .onChange((val: string) => {
                                console.log(metric)
                                metric.setTotalUnits(parseInt(val))
                            })
                    })
            }))

        return this;
    }

}


