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
  if (!DATAVERSE_KEY) {
    throw new Error("No Dataverse API key provided");
  }

  return fetch(COLLECTION_CONTENT(name), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 360 },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return { status: "error", data: [] }; // Return fallback structure
    });
}

function fetchDatasetJson(id: string | number) {
  if (!DATAVERSE_KEY) {
    throw new Error("No Dataverse API key provided");
  }

  return fetch(DATASET_JSON(id), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 360 },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return { status: "error", data: null }; // Return fallback structure
    });
}

function fetchDatasetJsonByPID(pid: string) {
  if (!DATAVERSE_KEY) {
    throw new Error("No Dataverse API key provided");
  }

  return fetch(DATASET_JSON_PID(pid), {
    headers: {
      "X-Dataverse-key": DATAVERSE_KEY,
    },
    next: { revalidate: 360 },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      return { status: "error", data: null }; // Return fallback structure
    });
}

async function fetchAllCollectionDatasets(collection: CollectionItem) {
  const content: CollectionContent = await fetchCollectionContent(
    collection.id,
  );
  const dsRefs: CollectionItem[] = getDatasetsFromCollection(content);

  const datasets = await Promise.all(
    dsRefs.map(async (ds: CollectionItem) => {
      const response: DatasetResponse = await fetchDatasetJson(
        ds.id.toString(),
      );
      return response.data;
    }),
  );

  // Filter out null/undefined datasets
  return datasets.filter((dataset) => dataset != null);
}

async function fetchLinkedDatasets(collectionName: string) {
  const linkedDatasets: Dataset[] = await Promise.all(
    LINKED_DATASETS[collectionName].map(async (pid: string) => {
      const response: DatasetResponse = await fetchDatasetJsonByPID(pid);
      return response.data;
    }),
  );

  // Filter out null/undefined datasets
  return linkedDatasets.filter((dataset) => dataset != null);
}

// Collection functions
function getDatasetsFromCollection(collection: CollectionContent) {
  if (!collection || !collection.data || !Array.isArray(collection.data)) {
    return [];
  }
  return collection.data.filter((item: any) => item.type === "dataset");
}

function getSubCollectionsFromCollection(collection: CollectionContent) {
  if (!collection || !collection.data || !Array.isArray(collection.data)) {
    return [];
  }
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
  try {
    // @ts-ignore
    const titleField = dataset.metadataBlocks?.citation?.fields?.find(
      (field: any) => field.typeName === "title",
    );
    return titleField?.value || "Untitled Dataset";
  } catch (error) {
    console.log("Error getting dataset title:", error);
    return "Untitled Dataset";
  }
}
