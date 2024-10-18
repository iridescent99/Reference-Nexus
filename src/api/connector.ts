import {ReferenceSearch} from "../search/referenceSearch";
import * as crypto from "crypto";

export class Connector {

    modal: ReferenceSearch;

    constructor( modal: ReferenceSearch ) {

        this.modal = modal;

    }

    async getBooks( query: string ) {

        // What is limit of pager??
        await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${this.modal.plugin.settings.apiKeys.googleBooks.key}`
        ).then((resp) => resp.json())
            .then((data) => this.modal.setResults(this.transformGoogleOutput(data.items)))
            .catch(error => console.error('Error:', error));

    }

    transformGoogleOutput( data: any[] ) {
        return data.map((item) => {
            const formatted = {
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                type: "book",

            }
            return {
                id: this.generateHash( JSON.stringify(formatted) ),
                ...formatted,
                metrics: this.modal.plugin.settings.metrics["book"]
            }
        })
    }

    async getResearchPapers( query: string ) {
        const queryParams = new URLSearchParams({
            query: query,
            fields: "title,url,publicationTypes,publicationDate,openAccessPdf",
        })
        await fetch(
            `http://api.semanticscholar.org/graph/v1/paper/search/bulk?${queryParams.toString()}`,

        ).then((resp) => resp.json())
            .then((data) => this.modal.setResults(this.transformSemanticScholarOutput(data.articles)))
            .catch(error => console.error('Error:', error));
    }

    async getArticles( query: string ) {
        // TODO: CORS blocked
        await fetch(
            `https://newsapi.org/v2/everything?q=${query}&apiKey=${this.modal.plugin.settings.apiKeys.newsApi.key}`
        ).then((resp) => console.log(resp.json()))
            // .then((data) => this.modal.setResults(this.transformNewsAPIOutput(data.articles)));
            .catch(error => console.error('Error:', error));
    }

    private generateHash( data: string ) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    transformNewsAPIOutput( data: any [] ) {

        return data.map((item) => {
            const formatted = {
                title: item.title,
                authors: item.author,
                platform: item.platform,
                type: "article"
            }
            return {
                id: this.generateHash( JSON.stringify(formatted) ),
                ...formatted,
                metrics: this.modal.plugin.settings.metrics["article"]
            }
        })
    }

    transformSemanticScholarOutput( data: any [] ) {
        return data.map((item) => {
            return {
                title: item.title,
                authors: item.author.map((author: any) => author.name),
                type: "research paper"
            }
        })
    }

}