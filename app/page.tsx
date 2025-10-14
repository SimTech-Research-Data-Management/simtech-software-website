import fetchDatasets from "./dvloader";
import { DatasetCollection } from "./types";
import Collection from "./collection";
import SideBar from "./sidebar";

interface queryParams {
  key?: string;
}

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<queryParams>;
}) {
  const collections = await fetchDatasets();
  const resolvedSearchParams = await searchParams;

  return (
    <div className="px-6">
      <div className="grid grid-cols-12 h-screen">
        <div className="hidden md:block md:col-span-2">
          <SideBar collections={collections} />
        </div>
        <div className="col-span-12 md:col-span-10 mx-5 overflow-y-scroll scrollbar-hide md:ml-24">
          <div className="h-34 my-12" />
          {collections.map((collection: DatasetCollection, index: number) => {
            if (
              resolvedSearchParams.key === collection.name ||
              resolvedSearchParams.key === undefined
            ) {
              return (
                <Collection
                  collection={collection}
                  key={"collection" + index.toString()}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
