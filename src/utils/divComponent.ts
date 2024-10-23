import {Component} from "obsidian";
import {StyleSettings} from "../reference_nexus";
import {CustomComponent} from "./customComponent";
import {ElementComponent} from "./elementComponent";


export class DivComponent extends CustomComponent {

    constructor( parent: any, config: DomElementInfo = {}, classPrefix: string = "" ) {

        super(classPrefix);
        this.el = parent.createDiv( config );
        this.CSS_PROPERTIES = Object.keys(this.el.style);
        return this;

    }

    children() {
        return this.el.children;
    }

    setClass( cls: string ) {

        this.el.className += " " + cls;
        return this;

    }

    setText( text: string ) {

        this.el.textContent = text;
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
        this.registerDomEvent( this.el, eventName, callback )
    }

    createChild( tag: keyof HTMLElementTagNameMap, config: DomElementInfo = {} ): CustomComponent {

        let child: CustomComponent;
        if ( tag === "div") {
            child = new DivComponent( this.el, config )
            this.el.appendChild( child.el );
            return child;
        }

        return new ElementComponent( tag, this.el, config );

    }

}