


interface Metric {
    name: string;
    unit: string|null;
    binary: boolean;
}

interface Settings {
    metrics: Metric[]
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