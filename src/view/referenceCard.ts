import {IReference} from "../reference_nexus";
import {ReferenceDiv} from "./referenceDiv";
import {ReferenceView} from "./referenceView";


export class ReferenceCard {

    data: IReference;
    container: HTMLElement;

    constructor( view: ReferenceView, reference: IReference ) {

        this.data = reference;
        this.container = new ReferenceDiv( view, reference );
        view.contentEl.appendChild( this.container );
        this.standardBuild();

        return this;

    }

    private standardBuild( ) {



    }


}