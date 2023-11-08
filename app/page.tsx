import Link from "next/link"
import Card from "./card"
import fetchDatasets from "./dvloader"
import { Dataset } from "./types"

export default async function Home() {
  const collections = await fetchDatasets()

  return (
    <div className="p-20">
      <div className="fixed h-full">
        <h1 className="text-5xl text-neutral-200">SimTech</h1>
        <h2 className="text-3xl text-neutral-200">{"/" + "software"}</h2>
      </div>
      <div className="grid grid-cols-12 my-28">
        <div className="col-span-3">
          <div className="fixed h-screen">
            {
              collections.map((collection, index) => (
                <div className="flex flex-col" key={"sidelem" + index.toString()}>
                  <Link
                    href={"#" + collection.name}
                    className="text-2xl font-thin hover:translate-x-1"
                  >
                    {collection.name}
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
        <div className="safari:col-span-9 chrome:col-span-9 mx-5">
          {
            collections.map((collection, index) => (
              <div className="flex flex-col mb-10" key={"topic" + index.toString()}>
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
                    <Card dataset={dataset} key={"entry" + collection.name.toLowerCase() + index} />
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}
