import Card from "./card";
import { CollectionItem, Dataset, DatasetCollection } from "./types";

export default function Collection(
    {
        collection,
    }: {
        collection: DatasetCollection,
    }
) {

    return (
        <div className="flex flex-col mb-10">
            <div className="flex flex-row place-items-center">
                <div className="badge bg-neutral-800 text-gray-400 border-0 mx-2">{collection.datasets.length}</div>
                <h1
                    className="text-3xl font-medium text-neutral-200"
                    id={collection.name}
                >
                    {collection.name}
                </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-0">
                {collection.datasets.map((dataset: Dataset, index) => (
                    <Card
                        dataset={dataset}
                        key={"entry" + collection.name.toLowerCase() + index}
                    />
                ))}
            </div>
        </div>
    )
} 