import ReferenceNexus from "../index";
import crypto from "crypto";


export class Tools {

    plugin: ReferenceNexus
    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
    }

    public generateHash( data: string ) {
        return crypto.createHash('sha256').update(data).digest('hex').slice(0,24);
    }
}