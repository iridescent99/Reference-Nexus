import ReferenceNexus from "../index";
import crypto from "crypto";
import {MetadataCache, Notice, TFile} from "obsidian";
import {IReference} from "../reference_nexus";


export class Tools {

    plugin: ReferenceNexus
    constructor( plugin: ReferenceNexus ) {
        this.plugin = plugin;
    }

    public generateHash( data: string ) {
        return crypto.createHash('sha256').update(data).digest('hex').slice(0,24);
    }

    async openReferenceNote( reference: IReference ) {
        console.log(reference)
        let file;
        if (!reference.notePath) {
            file = await this.createReferenceNote( reference );
        } else {
            file = this.plugin.app.vault.getAbstractFileByPath( reference.notePath );
            if (!file) file = await this.createReferenceNote( reference );
        }

        if ( file ) {
            const leaf = this.plugin.app.workspace.getLeaf(true);

            await leaf.openFile(file as TFile);

            this.plugin.app.workspace.setActiveLeaf(leaf);
        }


    }

    async createReferenceNote( reference: IReference ) {
        const folder = this.plugin.settings.referenceNoteLocations[reference.type];
        let file;

        const template = this.plugin.app.vault.getFileByPath(this.plugin.settings.templateLocations[reference.type]);

        reference.notePath = folder + "/" + reference.title + ".md";

        if (template) file = await this.plugin.app.vault.copy(template, reference.notePath).then(() => this.plugin.app.vault.getFileByPath(reference.notePath) as TFile);

        if (file) return await this.setFileProperties(reference, file)
        else new Notice("Failed to create reference note for " + reference.title)
    }


    async setFileProperties( reference: IReference, file: TFile ) {

        await this.plugin.app.fileManager.processFrontMatter(file, (frontMatter) => {
            frontMatter.title = reference.title;
            if (reference.authors) {
                frontMatter.authors = reference.authors
            }
            frontMatter.referenceID = reference.id;
            if (reference.platform) {
                frontMatter.platform = reference.platform;
            }
            if (reference.chapterCount && reference.chapterCount > 0) {
                frontMatter.chapterCount = reference.chapterCount;
            }
            if (reference.pageCount && reference.pageCount > 0) {
                frontMatter.pageCount = reference.pageCount;
            }
        });

        return file;

    }



}