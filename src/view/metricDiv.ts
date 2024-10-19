import {IMetric, IReference} from "../reference_nexus";
import {ReferenceMetric} from "./metric";
import {ReferenceView} from "./referenceView";
import {reference} from "@popperjs/core";
import {ReferenceDiv} from "./referenceDiv";

export class MetricDiv extends HTMLDivElement {

    className: string = "reference-metrics"
    view: ReferenceView;

    constructor(view: ReferenceView, reference: IReference, metrics: IMetric[] ) {

        super();
        this.view = view;
        console.log(metrics)
        metrics.map((metric: IMetric) => {

            this.appendChild(
                new ReferenceMetric( view, reference, metric )
                    .setColor()
                    .setTooltip()
            )

        });

        this.createDiv( { text: "+", cls: "metric add-metric" } )
            .addEventListener;

    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        this.view.addOnUnload(() => this.removeEventListener(type, listener, options));
        super.addEventListener(type, listener, options);
    }



}