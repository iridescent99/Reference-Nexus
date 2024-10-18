import {Reference} from "../reference_nexus";
import {ReferencePropertyDiv} from "./referencePropertyDiv";
import {MetricDiv} from "./metricDiv";
import {ReferenceView} from "./referenceView";


export class ReferenceDiv extends HTMLDivElement {

    className: string = "reference-container";
    reference: Reference;
    view: ReferenceView;

    constructor( view: ReferenceView, reference: Reference ) {

        super();
        this.view = view;
        this.reference = reference;
        this.createChildNodes()

    }

    private createChildNodes( ) {

        for (let [key, value] of Object.entries(this.reference)) {

            if (!["metrics", "id"].includes(key)) this.appendChild( new ReferencePropertyDiv( this.view, this.reference, key, value) );
            else if (key === "metrics") this.appendChild( new MetricDiv( this.view, this.reference, value ) );

        }

    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        this.view.addOnUnload(() => this.removeEventListener(type, listener, options));
        super.addEventListener(type, listener, options);
    }

}