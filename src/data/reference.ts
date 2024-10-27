import {IMetric, IReference, Metadata, ObsidianLink} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {Metric} from "./metric";
import ReferenceNexus from "../index";


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
    links: ObsidianLink[] = [];
    image: string = "";
    url: string = "";

    constructor( plugin: ReferenceNexus, args: any ) {
        for ( let [key, value] of Object.entries(args)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
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
    }

    createMetric() {
        this.metrics.push(new Metric( { name: "new metric", unit:"chapter" } ));
    }

    deleteMetric( metric: IMetric ) {
        this.metrics.remove( metric );
    }

    linkExists( id: string ) {
        console.log(id);
        return true;
    }

    updateProperty( key: string, value: string ) {
        switch (key) {
            case "title":
                this.title = value;
                break;
            case "authors":
                // TODO: fix authors
                this.authors = value.split(" ");
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
            default:
                break;

        }
    }

}