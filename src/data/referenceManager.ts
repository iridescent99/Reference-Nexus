import ReferenceNexus from "../index";
import {IReference} from "../reference_nexus";
import {ReferenceType} from "../search/typePicker";
import {Notice, TFile} from "obsidian";
import {Reference} from "./reference";
import {EnrichMode} from "./referenceEnricher";
import {reference} from "@popperjs/core";

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

    reloadView() {
        if (this.plugin.referenceManager.updateView) this.plugin.referenceManager.updateView()
        else this.plugin.activateView()
    }

    public async loadReferences() {
        for (let type of Object.values(ReferenceType)) {
            const path = `${this.plugin.settings.referencesLocation}/${type}.json`;
            const file  = this.plugin.app.vault.getFileByPath(path) as TFile;
            if (file) {
                // @ts-ignore
                await this.plugin.app.vault.read(file).then((data: any) => {
                    const items = JSON.parse(data).items;
                    this.references = [...this.references, ...items.map((item: any) => new Reference(this.plugin, item))];
                    this.references.forEach((reference: IReference) => reference.syncNote())
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
            await this.writeReference( reference );
            this.reloadView()
        }
        new Notice("Reference is already stored in your database!")
    }

    public updateReference( reference: IReference ) {
        this.updateJSON( reference.type );
    }

    async writeReference( reference: IReference ) {
        // TODO: remove note from reference before saving
        const referencePath = `${this.plugin.settings.referencesLocation}/${reference.type}.json`;
        if (!this.plugin.app.vault.getAbstractFileByPath(referencePath)) {
            if (!this.plugin.app.vault.getFolderByPath(this.plugin.settings.referencesLocation)) {
                await this.plugin.app.vault.createFolder(this.plugin.settings.referencesLocation)
            }
            return this.plugin.app.vault.create(referencePath, JSON.stringify({items: [reference.json()]}));
        } else {
            const file = this.plugin.app.vault.getFileByPath(referencePath);
            if (file) {
                const currentReferencesOfType = await this.plugin.app.vault.read(file).then((data) => JSON.parse(data));
                currentReferencesOfType.items.push(reference);
                return await this.plugin.app.vault.modify(file, JSON.stringify(currentReferencesOfType));
            }

        }
    }

    getReferenceById( id: string ) {
        return this.references.filter((reference: IReference) => reference.id === id)[0] || null;
    }

    getReferencesByType( type: ReferenceType ) {
        return this.references.filter((reference: IReference) => reference.type === type).map((reference: IReference) => reference.json());
    }

    async updateJSON( type?: ReferenceType ) {
        if (type) {
            await this.saveTypeFile( type );
        } else {
            for ( let type of Object.values(ReferenceType) ) {
                await this.saveTypeFile( type );
            }
        }
        this.reloadView()

    }

    async saveTypeFile( type: ReferenceType ) {
        const referencePath = `${this.plugin.settings.referencesLocation}/${type}.json`;
        const file = this.plugin.app.vault.getFileByPath(referencePath);
        if (file) {
            await this.plugin.app.vault.modify(file, JSON.stringify({
                items: this.getReferencesByType(type)
            }));
        }
    }

    scanForLinks( ) {

        this.clearLinks();
        const propertyKey = this.plugin.settings.identifier;
        this.plugin.app.vault.getFiles().forEach(( file: TFile ) => {
            const metadata = this.plugin.app.metadataCache.getFileCache( file );
            if ( metadata?.frontmatter && metadata.frontmatter[propertyKey] ) {
                const reference = this.getReferenceById( metadata.frontmatter[propertyKey] );
                if (reference) reference.links.push({ file: file });
            }
        })

    }

    clearLinks() {
        this.references.forEach((reference: IReference) => reference.links = []);
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
    }

}