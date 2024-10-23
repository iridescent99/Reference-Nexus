import {DivComponent} from "./divComponent";
import {Metric} from "../data/metric";
import {IMetric} from "../reference_nexus";
import {Component} from "obsidian";


export class ProgressBar extends DivComponent {

    progressLabel: Component;
    metric: IMetric;
    progressBar: DivComponent;
    progress: DivComponent;

    constructor( parent: HTMLElement, metric: IMetric, classPrefix: string ) {

        super( parent, {}, classPrefix );
        this.registerDragEvent();
        this.metric = metric;
        this.classPrefix = classPrefix;
        this.initialize();

    }

    initialize() {

        this.progressLabel = this.createChild("div", { text: `${this.metric.name}`, cls: `${this.classPrefix}-metric-title metric-title` })

        this.progressBar = new DivComponent( this.el )
            .setClass(`${this.classPrefix}-progress-bar`)
        this.progress = new DivComponent( this.progressBar.el )
            .setClass( `${this.classPrefix}-progress` )
            .setText(`${this.metric.calculateProgress()}%`)

        const baseCSS = {
            width: `${this.metric.calculateProgress()}%`,
            background: this.metric.color
        }

        this.progress.setStyle(this.metric.calculateProgress() > 95 ?
                {...baseCSS, borderBottomRightRadius: "15px", borderTopRightRadius: "15px"} : baseCSS)

    }

    registerDragEvent() {

        // this.on('mousedown', (e: MouseEvent) => {
        //     this.isDragging = true;
        //     this.updateProgress(e);
        // })
        // this.on('mouseup', () => {
        //     this.isDragging = false;
        // })
    }

}