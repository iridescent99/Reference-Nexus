import {Component} from "obsidian";
import {CustomComponent} from "./customComponent";


export class ElementComponent extends CustomComponent {

    el: any;

    constructor( tag: keyof HTMLElementTagNameMap, parent: HTMLElement, config: DomElementInfo = {},  classPrefix: string = "" ) {
        super(classPrefix);
        this.el = parent.createEl(tag, config) as HTMLElementTagNameMap[typeof tag];
    }

}