import {IMetric, IReference} from "../reference_nexus";
import {ReferenceDiv} from "./referenceDiv";
import {ReferenceView} from "./referenceView";

export class ReferencePropertyDiv extends HTMLDivElement {

    name: string;
    view: ReferenceView;

    constructor(view: ReferenceView, reference: IReference, name: string, value: string|string[] ) {

        super();
        this.view = view;
        this.name = name;
        this.className = `reference-${this.name}`;

        // @ts-ignore
        this.textContent = typeof value !== "string" ? value?.join(", ") : value


    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        this.view.addOnUnload(() => this.removeEventListener(type, listener, options));
        super.addEventListener(type, listener, options);
    }


}