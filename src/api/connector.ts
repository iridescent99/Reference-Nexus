import {ReferenceSearch} from "../search/referenceSearch";


export class Connector {

    modal: ReferenceSearch;

    constructor( modal: ReferenceSearch ) {

        this.modal = modal;

    }

    async getBooks( query: string ) {

        // What is limit of pager??
        await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${this.modal.plugin.settings.apiKeys.googleBooks}`
        ).then((resp) => resp.json())
            .then((data) => this.modal.setResults(this.transformGoogleOutput(data.items)))
            .catch(error => console.error('Error:', error));

    }

    transformGoogleOutput( data: any[] ) {
        return data.map((item) => {
            return {
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                type: "book"
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
            `https://newsapi.org/v2/everything?q=${query}&apiKey=${this.modal.plugin.settings.apiKeys.newsApi}`
        ).then((resp) => console.log(resp.json()))
            // .then((data) => this.modal.setResults(this.transformNewsAPIOutput(data.articles)));
            .catch(error => console.error('Error:', error));
    }

    transformNewsAPIOutput( data: any [] ) {
        return data.map((item) => {
            return {
                title: item.title,
                authors: item.author,
                type: "article"
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