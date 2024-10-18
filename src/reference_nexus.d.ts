import {ReferenceType} from "./search/typePicker";
import {TFile} from "obsidian";

interface KeyConfig {
    [key: string]: string;
    key: string;
    url: string;
}

interface ApiKeySet {
    [key: string]: KeyConfig;
    googleBooks: KeyConfig;
    newsApi: KeyConfig;
}

interface Metric {
    name: string;
    unit: string|null;
    isBinary: boolean;
    totalUnits: number;
    currentUnit: number;
    completed: boolean;
}

interface ReferenceMetric {
    [key: string]: Metric[];
    book: Metric[];
    article: Metric[];
    course: Metric[];
    "research paper": Metric[];
    video: Metric[];
}

interface Settings {
    metrics: Object<ReferenceMetric>;
    apiKeys: ApiKeySet;
    referencesLocation: string
}

interface ObsidianLink {
    [key: string]: any;
    file: TFile;

}

interface Metadata {
    creationDate: Date;
    lastUpdated: Date;
}

interface Reference {
    id: string;
    title: string;
    authors: string[];
    meta:Metadata;
    type: ReferenceType;
    metrics: Metric[];
    links: ObsidianLink[];
}


export {
    Metric,
    Settings,
    Reference,
    ReferenceMetric
}