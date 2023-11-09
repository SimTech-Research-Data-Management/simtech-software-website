import Link from "next/link"
import { DatasetCollection } from "./types"

export default function SideBar(
    {
        collections,
    }: {
        collections: DatasetCollection[]
    }
) {
    return (
        <div className="fixed h-screen">
            <div className="flex flex-col" key={"sidelemAll"}>
                <Link
                    href="/"
                    className="text-2xl font-normal hover:translate-x-1 mb-2"
                >
                    All topics
                </Link>

            </div>
            {
                collections.map((collection, index) => (
                    <div className="flex flex-col" key={"sidelem" + index.toString()}>
                        <Link
                            href={"/?key=" + collection.name}
                            className="text-2xl font-thin hover:translate-x-1"
                        >
                            {collection.name}
                        </Link>
                    </div>
                ))
            }
        </div>
    )
} 