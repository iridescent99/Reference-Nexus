import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {TFile} from "obsidian";
import {Reference} from "./reference";
import {EnrichMode} from "./referenceEnricher";

export class ReferenceManager {

    plugin: ReferenceNexus
    references: IReference[] = [];
    updateView: Function;

    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
    }

    setCallback( fn: () => void ) {
        this.updateView = fn;
    }

    public async loadReferences() {
        for (let type of Object.values(ReferenceType)) {
            const path = `${this.plugin.settings.referencesLocation}/${type}.json`;
            const file  = this.plugin.app.vault.getFileByPath(path) as TFile;
            if (file) {
                // @ts-ignore
                await this.plugin.app.vault.read(file).then((data: any) => {
                    const items = JSON.parse(data).items;
                    this.references = [...this.references, ...items.map((item: any) => new Reference(this.plugin, item))]
                })
            }
        }
    }

    private referenceExists( id: string ) {
        return this.references.filter((reference: IReference) => reference.id === id).length > 0;
    }

    public async addReference( reference: IReference ) {
        if (!this.referenceExists( reference.id )) {
            this.references.unshift( reference );
            return await this.writeReference( reference )
                .then(() => this.plugin.activateView())
                .catch((e) => console.log(e));
        }
    }

    public updateReference( reference: IReference ) {
        this.updateJSON( reference.type );
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
            .updateMode( EnrichMode.ADD )
            .setReference( reference )
            .open( )
    }

    public removeReference( reference: IReference ) {
        this.references.remove(reference);
        this.updateJSON( reference.type );
        // this.updateView();
    }

}