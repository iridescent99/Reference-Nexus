import {IMetric, IReference, Metadata, ObsidianLink} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {Metric} from "./metric";
import ReferenceNexus from "../index";
import {Notice, TFile} from "obsidian";


export class Reference implements IReference {

    id: string = "";
    type: ReferenceType = ReferenceType.BOOK;
    title: string = "";
    authors: string[] = [];
    platform: string = "";
    metrics: IMetric[] = [];
    meta: Metadata;
    pageCount: number|null = -1;
    chapterCount: number|null = -1;
    image: string = "";
    url: string = "";
    notePath: string = "";
    plugin: ReferenceNexus;
    note: TFile;
    noteId: string;

    constructor( plugin: ReferenceNexus, args: any ) {
        this.plugin = plugin;
        for ( let [key, value] of Object.entries(args)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                if (key === "title") { // @ts-ignore
                    this.title = value.trim()                                 // Trim leading/trailing whitespace
                        .replace(/[\/:*?"<>|]/g, '-')           // Replace forbidden characters with a dash
                        .replace(/\s+/g, ' ')                   // Replace multiple spaces with a single space
                        .replace(/[^a-zA-Z0-9 -]/g, '');
                }
                // @ts-ignore
                if (key === "metrics") this.metrics = value.map((data: any) => new Metric(data))
                // @ts-ignore
                else this[key] = value;
            }
        }
        if (!args.metrics) this.metrics = plugin.settings.metrics[this.type].map((config: any) => {
            const base = {name: config.name, unit: config.unit};
            if (this.type === 'video') return new Metric( {...base, isBinary: true})
            return new Metric( base )
        });
        if (!this.notePath) {
            this.notePath = plugin.settings.referenceNoteLocations[this.type] + "/" +
                this.title[0].toUpperCase() + this.title.slice(1).toLowerCase() + ".md";
        }
    }

    async syncNote() {
        let file;
        try {
            file = this.plugin.app.vault.getAbstractFileByPath(this.notePath) as TFile;
        } catch (e) {
            console.error(e)
            const templateFile = this.plugin.app.vault.getAbstractFileByPath(
                this.plugin.settings.templateLocations[this.type]) as TFile;
            if (templateFile) {
                await this.plugin.app.vault.copy(templateFile, this.notePath);
                file = this.plugin.app.vault.getAbstractFileByPath(this.notePath) as TFile;
            } else {
                new Notice("Template for reference type" + this.type + "cannot be loaded.");
            }
        }
        // @ts-ignore
        this.note = file;
    }

    json() {
        let base: any = {
            id: this.id,
            title: this.title,
            type: this.type,
            authors: this.authors,
            platform: this.platform,
            metrics: this.metrics,
            pageCount: this.pageCount,
            chapterCount: this.chapterCount,
            image: this.image
        };
        if (["article", "video", "course"].includes(this.type)) {
            base = {
                ...base,
                url: this.url,
                platform: this.platform
            }
        }
        return base;
    }

    createMetric() {
        this.metrics.push(new Metric( { name: "new metric", unit:"chapter" } ));
    }

    deleteMetric( metric: IMetric ) {
        this.metrics.remove( metric );
    }

    linkExists( id: string ) {
        return true;
    }

    updateProperty( key: string, value: string ) {
        switch (key) {
            case "title":
                this.title = value;
                break;
            case "authors":
                // TODO: fix authors
                this.authors = value.split(";").map((author: string) => author.trim());
                break;
            case "platform":
                this.platform = value;
                break;
            case "pageCount":
                this.pageCount = parseInt(value);
                break;
            case "chapterCount":
                this.chapterCount = parseInt(value);
                break;
            case "image":
                this.image = value;
                break;
            case "url":
                this.url = value;
                break;
            case "notePath":
                this.notePath = value;
                if (this.note) {
                    this.plugin.app.vault.rename(this.note, this.notePath).then(() => new Notice("Reference note renamed"))
                        .catch((err) => new Notice(err));
                }
                break;
            default:
                break;

        }
    }

}