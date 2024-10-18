import {ReferenceType} from "./search/typePicker";

interface ApiKeySet {
    googleBooks: string;
    newsApi: string;
}

interface Metric {
    name: string;
    unit: string|null;
    binary: boolean;
}

interface Settings {
    metrics: Metric[],
    apiKeys: ApiKeySet
}

interface Reference {
    title: string;
    authors: string[];
    type: ReferenceType;
}


export {
    Metric,
    Settings,
    Reference,
}