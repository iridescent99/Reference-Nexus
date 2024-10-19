import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {TFile} from "obsidian";
import {Reference} from "./reference";

export class ReferenceManager {

    plugin: ReferenceNexus
    references: IReference[] = [];

    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
    }

    public async loadReferences() {
        for (let type of Object.values(ReferenceType)) {
            const path = `${this.plugin.settings.referencesLocation}/${type}.json`;
            const file  = this.plugin.app.vault.getFileByPath(path) as TFile;
            if (file) {
                // @ts-ignore
                await this.plugin.app.vault.read(file).then((data: any) => {
                    const items = JSON.parse(data).items;
                    console.log(data);
                    this.references = [...this.references, ...items]
                })
            }
        }
    }

    private referenceExists( id: string ) {
        return this.references.filter((reference: IReference) => reference.id === id).length > 0;
    }

    private async addReference( plugin: ReferenceNexus, reference: IReference ) {
        const refMan = plugin.referenceManager;
        if (!refMan.referenceExists( reference.id )) {
            refMan.references.unshift( reference );
            return await refMan.writeReference( reference )
                .then(() => plugin.activateView())
                .catch((e) => console.log(e));
        }
    }

    async writeReference( reference: IReference ) {
        const referencePath = `${this.plugin.settings.referencesLocation}/${reference.type}.json`;
        if (!this.plugin.app.vault.getAbstractFileByPath(referencePath)) {
            if (!this.plugin.app.vault.getFolderByPath(this.plugin.settings.referencesLocation)) {
                await this.plugin.app.vault.createFolder(this.plugin.settings.referencesLocation)
            }
            return this.plugin.app.vault.create(referencePath, JSON.stringify({items: [reference]}));
        } else {
            const file = this.plugin.app.vault.getFileByPath(referencePath);
            if (file) {
                const currentReferencesOfType = await this.plugin.app.vault.read(file).then((data) => JSON.parse(data));
                currentReferencesOfType.items.push(reference);
                return await this.plugin.app.vault.modify(file, JSON.stringify(currentReferencesOfType));
            }

        }
    }

    getReferencesByType( type: ReferenceType ) {
        return this.references.filter((reference: Reference) => reference.type === type);
    }

    async updateJSON( type: ReferenceType ) {
        const referencePath = `${this.plugin.settings.referencesLocation}/${type}.json`;
        const file = this.plugin.app.vault.getFileByPath(referencePath);
        if (file) {
            return await this.plugin.app.vault.modify(file, JSON.stringify({
                items: this.getReferencesByType(type)
            }));
        }
    }

    public enrichReference( reference: IReference ): void {
        this.plugin.referenceEnricher
            .setReference( reference )
            .setCallback( this.addReference )
            .open( )
    }

    public removeReference( reference: IReference ) {
        this.references.remove(reference);
        this.updateJSON( reference.type );
    }

}