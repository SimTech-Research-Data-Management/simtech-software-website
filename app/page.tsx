import Link from "next/link"
import Card from "./card"
import fetchDatasets from "./dvloader"
import { Dataset, DatasetCollection } from "./types"
import Collection from "./collection";
import SideBar from "./sidebar";

interface queryParams {
  key?: string;
}

export default async function Home(
  {
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: queryParams;
  }
) {

  const collections = await fetchDatasets()

  return (
    <div className="p-20">
      <div className="fixed h-full">
        <h1 className="text-5xl text-neutral-200">SimTech</h1>
        <h2 className="text-3xl text-neutral-200">{"/" + "software"}</h2>
      </div>
      <div className="grid grid-cols-12 my-28">
        <div className="col-span-3">
          <SideBar collections={collections} />
        </div>
        <div className="col-span-9 mx-5 -translate-y-24">
          {
            collections.map((collection: DatasetCollection, index: number) => {
              if (searchParams.key === collection.name || searchParams.key === undefined) {
                return (
                  <Collection
                    collection={collection}
                    key={"collection" + index.toString()}
                  />
                )
              }
            })
          }
        </div>
      </div>

    </div>
  )
}
