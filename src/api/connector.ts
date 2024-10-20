import {ReferenceSearch} from "../search/referenceSearch";
import * as crypto from "crypto";
import {Reference} from "../data/reference";

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
            const newRef = new Reference(this.modal.plugin, {
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors,
                type: "book",
                pageCount: item.volumeInfo.pageCount
            })
            return newRef;
        })
    }

    async getDataRP( paperId: string ){
        const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=url,year,authors,title,images`)}`,

        )

        // Parse the response and its contents
        const data = await response.json();
        const content = JSON.parse(data.contents);
        console.log(content)
        // Safely handle undefined 'objects' and transform the output
        const articles: Reference[] = this.transformSemanticScholarOutput(content.data || []);

        // Set the results in the modal
        this.modal.setResults(articles);
    }

    async getResearchPapers( query: string ) {

        try {
            const responseOne = await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.semanticscholar.org/graph/v1/paper/search/match?query=${query}`)}`,

            )

            // Parse the response and its contents
            const data = await responseOne.json();
            const content = JSON.parse(data.contents);

            const paperId = content.data[0].paperId;

            if (paperId) {
                setTimeout(() => this.getDataRP(paperId), 5000)
            }



        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    }

    private generateHash( data: string ) {
        return crypto.createHash('sha256').update(data).digest('hex').slice(0,24);
    }

    async getArticles( url: string ) {

        try {
            const queryParams = new URLSearchParams({
                url: url,
                token: this.modal.plugin.settings.apiKeys.diffBot.key
            });

            // Fetch the data from Diffbot via the allorigins proxy
            const response = await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.diffbot.com/v3/article?${queryParams}`)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Parse the response and its contents
            const data = await response.json();
            const content = JSON.parse(data.contents);

            // Safely handle undefined 'objects' and transform the output
            const articles: Reference[] = this.transformDiffBotOutput(content.objects || [], "article");

            // Set the results in the modal
            this.modal.setResults(articles);

        } catch (error) {
            console.error('Error fetching articles:', error);
        }

    }


    transformDiffBotOutput( data: any [], type: string ): Reference[]|[] {

        if (data && Array.isArray(data)) {
            return data.map((item) => {
                if (type === "article") {
                    // Ensure authors and images exist before mapping/accessing them
                    const authors = item.authors ? item.authors.map((author: any) => author.name) : [];
                    const image = item.images && item.images[0] ? item.images[0].url : null;

                    // Return a new Reference object based on the transformed data
                    return new Reference(this.modal.plugin, {
                        id: this.generateHash(`${item.title.toLowerCase()}|${item.siteName}`),
                        title: item.title || "Untitled",
                        authors: authors,
                        platform: item.siteName || "Unknown",
                        type: type,
                        image: image,
                        url: item.pageUrl,
                        pageCount: item.numPages || -1
                    });
                }
                // Ensure authors and images exist before mapping/accessing them
                const authors = item.author ? [item.author] : [];
                const image = item.images && item.images[0] ? item.images[0].url : null;

                // Return a new Reference object based on the transformed data
                return new Reference(this.modal.plugin, {
                    id: this.generateHash(`${item.title.toLowerCase()}|${item.siteName}`),
                    title: item.title || "Untitled",
                    authors: authors,
                    platform: item.pageUrl && item.pageUrl.split(".")[1] || "Unknown",
                    type: type,
                    image: image,
                    url: item.pageUrl
                });

            });
        }

        return []; // Return an empty array if data is invalid or not an array
    }

    transformSemanticScholarOutput( data: any [] ) {
        console.log(data)
        return data.map((item) => {
            return {
                title: item.title,
                authors: item.author.map((author: any) => author.name),
                type: "research paper"
            }
        })
    }

    async getVideos( url: string ) {

        try {
            const queryParams = new URLSearchParams({
                url: url,
                token: this.modal.plugin.settings.apiKeys.diffBot.key
            });

            // Fetch the data from Diffbot via the allorigins proxy
            const response = await fetch(
                `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.diffbot.com/v3/video?${queryParams}`)}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Parse the response and its contents
            const data = await response.json();
            const content = JSON.parse(data.contents);

            // Safely handle undefined 'objects' and transform the output
            const articles: Reference[] = this.transformDiffBotOutput(content.objects || [], "video");

            // Set the results in the modal
            this.modal.setResults(articles);

        } catch (error) {
            console.error('Error fetching articles:', error);
        }

    }

}