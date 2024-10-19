import {IMetric} from "../reference_nexus";


export class Metric implements IMetric {

    name: string = "metric name";
    isBinary: boolean = false;
    unit: string = "unit name";
    totalUnits: number = -1;
    currentUnit: number = -1;
    completed: boolean = false;

    constructor() {
    }

    setName( name: string ) {
        this.name = name;
        return this;
    }

    setUnit( unit: string ) {
        this.unit = unit;
        return this;
    }

    setCompleted( completed: boolean ) {
        this.completed = completed;
        return this;
    }

    setBinary( isBinary: boolean ) {
        this.isBinary = isBinary;
        return this;
    }

    setCurrentUnit( currentUnit: number ) {
        this.currentUnit = currentUnit;
        return this;
    }

    setTotalUnits( totalUnits: number ) {
        this.totalUnits = totalUnits;
        return this;
    }

}