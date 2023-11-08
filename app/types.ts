interface CollectionContent {
    status: string;
    data: CollectionItem[];
}

interface CollectionItem {
    id: number;
    type: string;
    title: string;
    identifier?: string;
    protocol?: string;
    authority?: string;
    publisher?: string;
    publicationDate?: string;
    storageIdentifier?: string;
    latestVersion?: number;
}

interface DatasetResponse {
    status: string;
    data: Dataset;
}

interface DatasetMeta {
    id: number;
    persistentUrl: string;
    protocol: string;
    identifier: string;
    latestVersion: number;
}

interface Dataset {
    id: number;
    datasetId: number;
    datasetPersistentId: string;
    versionState: string;
    metadataBlocks: { [key: string]: MetadataBlock };
}

interface MetadataBlock {
    displayName: string;
    name: string;
    fields: Field[];
}

interface Field {
    typeClass: string;
    typeName: string;
    multiple: boolean;
    value: string | { [key: string]: Field | Field[] };
    displayOrder: number;
    id: number;
    datasetFieldType: string;
}

export type { CollectionContent, CollectionItem, DatasetResponse, DatasetMeta, Dataset, MetadataBlock, Field };
