import {ReferenceType} from "./search/typePicker";
import {TFile} from "obsidian";
import ReferenceNexus from "./index";

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

interface TemplateLocationMap {
    [key: string]: string;
    book: string;
    course: string;
    video: string;
    "research paper": string;
    article: string;
}

interface Settings {
    metrics: Object<ReferenceMetric>;
    apiKeys: ApiKeySet;
    referencesLocation: string;
    appearInGraphView: boolean;
    showProgressInView: boolean;
    identifier: string;
    templateLocations: TemplateLocationMap;
    referenceNoteLocations: TemplateLocationMap;
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
    plugin: ReferenceNexus;
    id: string;
    noteId: string;
    title: string;
    authors: string[];
    meta:Metadata;
    pageCount: number|null;
    chapterCount: number|null;
    type: ReferenceType;
    metrics: IMetric[];
    url: string;
    note: TFile;
    image: string;
    notePath: string;
    json: () => any;
    createMetric: () => void;
    deleteMetric: ( metric: IMetric ) => void;
    linkExists: ( id: string ) => boolean;
    updateProperty: ( key: string, value: string ) => void;
    syncNote: () => void;
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