import {Settings} from "../reference_nexus";

// TODO: assume chronological progression?
export const DEFAULT_SETTINGS: Settings = {
    metrics: {
        "book": [{
            name: "reading",
            unit: "chapter",
            totalUnits: null,
            currentUnit: null
        }],
        "article": [{
            name: "reading",
            unit: "page",
            totalUnits: null,
            currentUnit: null
        }],
        "course": [{
            name: "completing",
            unit: "week",
            totalUnits: null,
            currentUnit: null
        }],
        "research paper": [{
            name: "reading",
            unit: "page",
            totalUnits: null,
            currentUnit: null
        }],
        "video": [{
            name: "viewing",
            unit: "minute",
            totalUnits: null,
            currentUnit: null
        }]

    },
    apiKeys: {
        googleBooks: {
            key: "",
            url: "https://developers.google.com/books/docs/v1/using"
        },
        newsApi: {
            key: "",
            url: "https://newsapi.org/register"
        }
    },
    referencesLocation: "references"
}