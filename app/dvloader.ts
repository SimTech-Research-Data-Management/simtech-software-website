import {
  CollectionContent,
  CollectionItem,
  Dataset,
  DatasetCollection,
  DatasetResponse,
} from "./types";

// Basic infos and credentials for the Dataverse API
const DATAVERSE_URL = "https://darus.uni-stuttgart.de";
const DATAVERSE_ROOT = "simtech_software";
const DATAVERSE_KEY = process.env.DATAVERSE_KEY;

// Endpoints
const COLLECTION_CONTENT = (name: string | number) =>
  `${DATAVERSE_URL}/api/dataverses/${name}/contents`;
const DATASET_JSON = (id: string | number) =>
  `${DATAVERSE_URL}/api/datasets/${id}/versions/:latest`;
const DATASET_JSON_PID = (pid: string) =>
  `${DATAVERSE_URL}/api/datasets/:persistentId/versions/:latest?persistentId=${pid}`;

// List of linked Datasets (cannot be fetched by API 😵)
const LINKED_DATASETS: { [key: string]: string[] } = {
  "Simulation Software": [
    "doi:10.18419/darus-3839",
    "doi:10.18419/darus-3788",
    "doi:10.18419/darus-3764",
    "doi:10.18419/darus-3405",
    "doi:10.18419/darus-3247",
    "doi:10.18419/darus-2125",
  ],
};

export default async function fetchDatasets() {
  const rootCollection: CollectionContent =
    await fetchCollectionContent(DATAVERSE_ROOT);
  const subCollections: CollectionItem[] =
    getSubCollectionsFromCollection(rootCollection);
  let collectionDatasets: DatasetCollection[] = await Promise.all(
    subCollections.map(async (collection: CollectionItem) => {
      let subDatasets: Dataset[] = await fetchAllCollectionDatasets(collection);

      if (LINKED_DATASETS[collection.title]) {
        const linkedDatasets: Dataset[] = await fetchLinkedDatasets(
          collection.title,
        );
        subDatasets = subDatasets.concat(linkedDatasets);
      }

      subDatasets = subDatasets.sort(compareDatasetTitles);

      return {
        name: collection.title,
        datasets: subDatasets,
      };
    }),
  );

  // Sort collections by name
  collectionDatasets = collectionDatasets.sort(
    (a: DatasetCollection, b: DatasetCollection) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    },
  );

  return collectionDatasets;
}

// Fetch functions
function fetchCollectionContent(name: string | number) {
  return fetch(COLLECTION_CONTENT(name), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 10 },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

function fetchDatasetJson(id: string | number) {
  return fetch(DATASET_JSON(id), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 10 },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

function fetchDatasetJsonByPID(pid: string) {
  return fetch(DATASET_JSON_PID(pid), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 10 },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

async function fetchAllCollectionDatasets(collection: CollectionItem) {
  const content: CollectionContent = await fetchCollectionContent(
    collection.id,
  );
  const dsRefs: CollectionItem[] = getDatasetsFromCollection(content);

  return await Promise.all(
    dsRefs.map(async (ds: CollectionItem) => {
      const response: DatasetResponse = await fetchDatasetJson(
        ds.id.toString(),
      );
      return response.data;
    }),
  );
}

async function fetchLinkedDatasets(collectionName: string) {
  const linkedDatasets: Dataset[] = await Promise.all(
    LINKED_DATASETS[collectionName].map(async (pid: string) => {
      const response: DatasetResponse = await fetchDatasetJsonByPID(pid);
      return response.data;
    }),
  );

  return linkedDatasets;
}

// Collection functions
function getDatasetsFromCollection(collection: CollectionContent) {
  return collection.data.filter((item: any) => item.type === "dataset");
}

function getSubCollectionsFromCollection(collection: CollectionContent) {
  return collection.data.filter((item: any) => item.type === "dataverse");
}

// Sorting function
function compareDatasetTitles(a: Dataset, b: Dataset) {
  const aTitle = getDatasetTitle(a);
  const bTitle = getDatasetTitle(b);

  if (aTitle < bTitle) {
    return -1;
  }

  if (aTitle > bTitle) {
    return 1;
  }

  return 0;
}

function getDatasetTitle(dataset: Dataset) {
  // @ts-ignore
  return dataset.metadataBlocks.citation.fields.find(
    (field: any) => field.typeName === "title",
  ).value;
}
