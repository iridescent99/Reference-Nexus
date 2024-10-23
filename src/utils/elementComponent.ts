import {Component} from "obsidian";
import {CustomComponent} from "./customComponent";


export class ElementComponent extends CustomComponent {

    element: HTMLElement;

    constructor( tag: keyof HTMLElementTagNameMap, parent: HTMLElement, config: DomElementInfo = {} ) {
        super();
        this.element = parent.createEl(tag, config);
    }

}