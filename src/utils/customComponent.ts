import {Component} from "obsidian";
import {StyleSettings} from "../reference_nexus";


export class CustomComponent extends Component {

    CSS_PROPERTIES: string[];
    el: HTMLElement;
    classPrefix: string;

    constructor( classPrefix: string ) {
        super( );
        this.classPrefix = classPrefix;
    }

    setClass( cls: string ) {

        if (this.el) this.el.className += " " + cls;
        return this;

    }

    setText( text: string ) {

        if (this.el) this.el.textContent = text;
        return this;

    }

    setStyle( settings: StyleSettings ) {

        for (let [property, value] of Object.entries(settings)) {
            if (this.CSS_PROPERTIES.includes(property)) {
                // @ts-ignore
                this.containerEl.style[property] = value;
            }
        }
        return this;

    }

    on( eventName: keyof HTMLElementEventMap, callback: (e: Event) => void ) {
        if (this.el) this.registerDomEvent( this.el, eventName, callback )
    }
}