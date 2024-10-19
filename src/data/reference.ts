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

    constructor( plugin: ReferenceNexus, args: any ) {
        for ( let [key, value] of Object.entries(args)) {
            console.log(key, value)

            if (Object.prototype.hasOwnProperty.call(this, key)) { // @ts-ignore
                this[key] = value;
            }
        }
        this.metrics = plugin.settings.metrics[this.type];
    }

    createMetric() {
        this.metrics.push(new Metric());
    }

    private generateHash( ) {
        // return crypto.createHash('sha256').update(data).digest('hex');
    }


}