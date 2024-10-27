import {DivComponent} from "./divComponent";
import {IMetric} from "../reference_nexus";
import {ProgressBar} from "./progressBar";


export class DashboardMetric extends DivComponent {

    metric: IMetric;
    progressBar: ProgressBar;

    constructor( parent: HTMLElement, metric: IMetric, config: DomElementInfo = {}, classPrefix = "") {
        super(parent, config, classPrefix);
        this.metric = metric;
        this.progressBar = new ProgressBar(this.el, metric, classPrefix)
    }
}