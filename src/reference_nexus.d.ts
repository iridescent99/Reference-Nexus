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

interface IMetric {
    name: string;
    unit: string|null;
    isBinary: boolean;
    totalUnits: number;
    currentUnit: number;
    completed: boolean;
    setName: ( name: string ) => IMetric;
    setUnit: ( unit: string ) => IMetric;
    setTotalUnits: ( totalUnits: number ) => IMetric;
    setCurrentUnit: ( currentUnit: number ) => IMetric;
    setCompleted: ( completed: boolean ) => IMetric;
    setBinary: ( isBinary: boolean ) => IMetric;
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
    links: ObsidianLink[];
    createMetric: () => void
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