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
        diffBot: {
            key: "",
            url: "https://docs.diffbot.com/reference/introduction-to-diffbot-apis"
        }
    },
    referencesLocation: "reference nexus",
    appearInGraphView: false,
    showProgressInView: false,
    identifier: "referenceID",
    templateLocations: {
        book: "reference nexus/templates/book.md",
        article: "reference nexus/templates/article.md",
        video: "reference nexus/templates/video.md",
        "research paper": "reference nexus/templates/researchPaper.md",
        course: "reference nexus/templates/course.md"
    },
    referenceNoteLocations: {
        book: "",
        article: "",
        video: "",
        "research paper": "",
        course: ""
    }
}