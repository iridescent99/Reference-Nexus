import {IMetric} from "../reference_nexus";


export class Metric implements IMetric {

    name: string = "reading";
    isBinary: boolean = false;
    unit: string = "unit name";
    totalUnits: number = -1;
    currentUnit: number = -1;
    color: string = "#000";
    completed: boolean = false;

    constructor( args: any ) {
        for ( let [key, value] of Object.entries(args)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                // @ts-ignore
                this[key] = value;
            }
        }
    }

    updateMetric( key: string, value: string ) {
        switch (key) {
            case "name":
                this.name = value;
                break;
            case "unit":
                this.unit = value;
                break;
            case "color":
                this.color = value;
                break;
            case "totalUnits":
                this.totalUnits = parseInt(value);
                break;
            case "currentUnit":
                this.currentUnit = parseInt(value);
                break;
            default:
                break;
        }
    }

    calculateProgress(): number {
        if (this.isBinary) return this.completed ? 100 : 0;
        return Math.floor(this.currentUnit / this.totalUnits  * 100);
    }

}