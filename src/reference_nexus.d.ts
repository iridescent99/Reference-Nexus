import {ReferenceType} from "./search/typePicker";

interface KeyConfig {
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
    binary: boolean;
    totalUnits: number;
    currentUnit: number;
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

interface Reference {
    id: string;
    title: string;
    authors: string[];
    type: ReferenceType;
    metrics: Metric[];
}


export {
    Metric,
    Settings,
    Reference,
    ReferenceMetric
}