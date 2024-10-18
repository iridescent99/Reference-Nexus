import {Reference} from "../reference_nexus";
import {ReferenceDiv} from "./referenceDiv";
import {ReferenceView} from "./referenceView";


export class ReferenceCard {

    data: Reference;
    container: HTMLElement;

    constructor( view: ReferenceView, reference: Reference ) {

        this.data = reference;
        this.container = new ReferenceDiv( view, reference );
        view.contentEl.appendChild( this.container );
        this.standardBuild();

        return this;

    }

    private standardBuild( ) {



    }


}