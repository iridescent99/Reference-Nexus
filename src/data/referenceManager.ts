import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {TFile} from "obsidian";
import {ReferenceDiv} from "../view/referenceDiv";
import {ReferenceEnricher} from "./referenceEnricher";

export class ReferenceManager {

    plugin: ReferenceNexus
    references: IReference[] = [];
    enricher: ReferenceEnricher;

    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
        this.enricher = new ReferenceEnricher(plugin);
    }

    public async loadReferences() {
        for (let type of Object.values(ReferenceType)) {
            const path = `${this.plugin.settings.referencesLocation}/${type}.json`;
            console.log(path)
            const file  = this.plugin.app.vault.getFileByPath(path) as TFile;
            console.log(file)
            if (file) {

                // @ts-ignore
                await this.plugin.app.vault.read(file).then((data: any) => {
                    const items = JSON.parse(data).items;
                    console.log(data);
                    this.references = [...this.references, ...items]
                })
            }
        }
        console.log(this.references)
    }

    private referenceExists( id: string ) {
        return this.references.filter((reference: IReference) => reference.id === id).length > 0;
    }

    private async addReference( reference: IReference ) {
        if (!this.referenceExists( reference.id )) {
            this.references.unshift( reference );
            return await this.writeReference( reference )
                .then(() => this.plugin.activateView())
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

    public enrichReference( reference: IReference ): void {
        this.enricher
            .setReference( reference )
            .setCallback( this.addReference )
            .open( )
    }

}