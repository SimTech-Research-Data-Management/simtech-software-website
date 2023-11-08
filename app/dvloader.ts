import { CollectionContent, CollectionItem, Dataset, DatasetResponse } from "./types";

// Basic infos and credentials for the Dataverse API
const DATAVERSE_URL = 'https://darus.uni-stuttgart.de';
const DATAVERSE_ROOT = 'simtech_software';
const DATAVERSE_KEY = '36ab6d45-a695-436a-add0-109950dd254f';

// Endpoints
const COLLECTION_CONTENT = (name: string | number) => `${DATAVERSE_URL}/api/dataverses/${name}/contents`;
const DATASET_JSON = (id: string | number) => `${DATAVERSE_URL}/api/datasets/${id}/versions/:latest`;

// Interfaces
interface DatasetCollection {
    name: string;
    datasets: Dataset[];
}

export default async function fetchDatasets() {
    const rootCollection: CollectionContent = await fetchCollectionContent(DATAVERSE_ROOT)
    const subCollections: CollectionItem[] = getSubCollectionsFromCollection(rootCollection);
    const collectionDatasets: DatasetCollection[] = await Promise.all(
        subCollections.map(async (collection: CollectionItem) => {
            const subDatasets: Dataset[] = await fetchAllCollectionDatasets(collection);
            return {
                name: collection.title,
                datasets: subDatasets
            };
        }));

    return collectionDatasets;
}

// Fetch functions
function fetchCollectionContent(name: string | number) {
    return fetch(COLLECTION_CONTENT(name), {
        headers: {
            'X-Dataverse-key': DATAVERSE_KEY
        }
    }).then((res) => res.json()).catch((err) => console.log(err));
}

function fetchDatasetJson(id: string | number) {
    return fetch(DATASET_JSON(id), {
        headers: {
            'X-Dataverse-key': DATAVERSE_KEY
        }
    }).then((res) => res.json()).catch((err) => console.log(err));
}

async function fetchAllCollectionDatasets(collection: CollectionItem) {
    const content: CollectionContent = await fetchCollectionContent(collection.id);
    const dsRefs: CollectionItem[] = getDatasetsFromCollection(content);

    return await Promise.all(dsRefs.map(async (ds: CollectionItem) => {
        const response: DatasetResponse = await fetchDatasetJson(ds.id.toString());
        return response.data;
    }));
}

// Collection functions
function getDatasetsFromCollection(collection: CollectionContent) {
    return collection.data.filter((item: any) => item.type === 'dataset');
}

function getSubCollectionsFromCollection(collection: CollectionContent) {
    return collection.data.filter((item: any) => item.type === 'dataverse');
}