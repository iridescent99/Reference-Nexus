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
    diffBot: KeyConfig;
}

interface IMetric {
    [key: string]: any;
    name: string;
    unit: string|null;
    isBinary: boolean;
    totalUnits: number;
    currentUnit: number;
    completed: boolean;
    color: string;
    updateMetric: ( key: string, value: string ) => void;
    calculateProgress: () => number;
}

interface ReferenceMetric {
    [key: string]: IMetric[];
    book: IMetric[];
    article: IMetric[];
    course: IMetric[];
    "research paper": IMetric[];
    video: IMetric[];
}

interface Settings {
    metrics: Object<ReferenceMetric>;
    apiKeys: ApiKeySet;
    referencesLocation: string;
    appearInGraphView: boolean;
    showProgressInView: boolean;
}

interface ObsidianLink {
    [key: string]: any;
    file: TFile;
}

interface Metadata {
    creationDate: Date;
    lastUpdated: Date;
}

interface IReference {
    [key: string]: any;
    id: string;
    title: string;
    authors: string[];
    meta:Metadata;
    pageCount: number|null;
    chapterCount: number|null;
    type: ReferenceType;
    metrics: IMetric[];
    url: string;
    image: string;
    links: ObsidianLink[];
    createMetric: () => void
    deleteMetric: ( metric: IMetric ) => void;
    linkExists: ( id: string ) => boolean;
    updateProperty: ( key: string, value: string ) => void;
}

interface StyleSettings {
    [key: string]: string;
}

export {
    IMetric,
    Metadata,
    Settings,
    IReference,
    ReferenceMetric,
    StyleSettings,
    ObsidianLink
}