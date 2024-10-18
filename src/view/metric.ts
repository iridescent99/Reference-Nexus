import {Metric, Reference} from "../reference_nexus";
import {ReferenceDiv} from "./referenceDiv";
import {ReferenceView} from "./referenceView";
import {Tooltip} from "./tooltip";


export class ReferenceMetric extends HTMLDivElement {

    data: Metric;
    view: ReferenceView;
    className: string = "metric tooltip-container";
    tooltipContainer: HTMLDivElement;
    colors: string[] = ["#b7b7b7", "#60efe9", "#dbee5e", "#53e570",
        "#8366d3"]

    constructor( view: ReferenceView, reference: Reference, metric: Metric ) {

        super();
        this.data = metric;
        this.view = view;
        this.className += ` metric-${metric.name}`;

        // this.addEventListener('dblclick', )

    }

    progress( ): number {

        if ( this.data.isBinary ) return this.data.completed ? 100 : 0;
        if (this.data.currentUnit && this.data.totalUnits) {
            return ( this.data.currentUnit / this.data.totalUnits ) * 100;
        }
        return 0;

    }

    setColor( ): ReferenceMetric {

        this.style.background = this.colors[Math.floor(this.progress() / 5)];
        return this;

    }

    setTooltip( ): ReferenceMetric {

        this.appendChild(
            new Tooltip(`${this.data.name} progress ${this.progress()}%`)
            .setStyle()
            .setInteractivity()
        )
        return this;

    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        this.view.addOnUnload(() => this.removeEventListener(type, listener, options));
        super.addEventListener(type, listener, options);
    }





}