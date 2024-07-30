import Link from "next/link";
import Image from "next/image";
import { DatasetCollection } from "./types";

export default function SideBar({
  collections = [],
}: {
  collections: DatasetCollection[];
}) {
  return (
    <div className="drawer lg:drawer-open mt-10 ml-2">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <Image
        src="/simtech_logo.png"
        alt="Example Image"
        width={200}
        height={100}
      />
      <div className="flex flex-col gap-3 py-10">
        <div className="flex flex-col" key={"sidelemAll"}>
          <Link
            href="/"
            className="text-2xl text-primary font-bold hover:translate-x-1 mb-2 duration-300"
          >
            All topics
          </Link>
        </div>
        {collections.map((collection, index) => {
          if (collection.datasets.length === 0) {
            return null;
          }

          return (
            <div className="flex flex-col" key={"sidelem" + index.toString()}>
              <Link
                href={"/?key=" + collection.name}
                className="text-md text-base-100 hover:translate-x-1 duration-300"
              >
                {collection.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
