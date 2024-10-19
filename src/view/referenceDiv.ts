import {IReference} from "../reference_nexus";
import {ReferencePropertyDiv} from "./referencePropertyDiv";
import {MetricDiv} from "./metricDiv";
import {ReferenceView} from "./referenceView";


export class ReferenceDiv extends HTMLDivElement {

    className: string = "reference-container";
    reference: IReference;
    view: ReferenceView;
    closeButton: HTMLButtonElement|null;

    constructor( view: ReferenceView, reference: IReference ) {

        super();
        this.view = view;
        this.reference = reference;
        this.createChildNodes()
        this.addEventListener('dblclick', () => {
            this.view.plugin.referenceEnricher
                .setReference( reference )
                .open( )
        });
        this.addEventListener('mouseenter', () => {
            this.setCloseButton()
        })
        this.addEventListener('mouseleave', () => {
            this.removeCloseButton();
        })
    }

    setCloseButton() {
        this.closeButton = this.createEl("button", { text: "x" });
        this.closeButton.style.position = "absolute";
        this.closeButton.addEventListener('click', () => {
            this.view.plugin.referenceManager.removeReference( this.reference );
            this.view.loadComponents();
        })
        this.appendChild(this.closeButton)
    }

    removeCloseButton() {
        if (this.closeButton) this.removeChild(this.closeButton);
        this.closeButton = null;
    }

    private createChildNodes( ) {

        for (let [key, value] of Object.entries(this.reference)) {

            if (["title", "authors", "type"].includes(key)) this.appendChild( new ReferencePropertyDiv( this.view, this.reference, key, value) );
            else if (key === "metrics") this.appendChild( new MetricDiv( this.view, this.reference, value ) );

        }

    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
        this.view.addOnUnload(() => this.removeEventListener(type, listener, options));
        super.addEventListener(type, listener, options);
    }

}