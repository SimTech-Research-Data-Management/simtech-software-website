import Card from "./card";
import { CollectionItem, Dataset, DatasetCollection } from "./types";

export default function Collection({
  collection,
}: {
  collection: DatasetCollection;
}) {
  if (collection.datasets.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col mb-10 min-w-full">
      <div className="flex flex-row place-items-center">
        <h1
          className="text-3xl pl-4 py-2 font-bold text-base-100 "
          id={collection.name}
        >
          {collection.name}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-5">
        {collection.datasets.map((dataset: Dataset, index) => (
          <Card
            dataset={dataset}
            key={"entry" + collection.name.toLowerCase() + index}
          />
        ))}
      </div>
    </div>
  );
}
