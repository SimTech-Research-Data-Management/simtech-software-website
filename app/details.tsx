import getCitationTitle, { getAuthors, getGitHubRepository, getKeywords, getProgrammingLanguages } from "./dsparser";
import { Dataset } from "./types";

export default function Details(
    {
        dataset
    }: {
        dataset: Dataset
    }
) {

    const datasetTitle: string = getCitationTitle(dataset)
    const keywords: string[] = getKeywords(dataset).sort()
    const authors: string[] = getAuthors(dataset)
    const authorsString: string = authors.join(", ")
    const gitHubRepositories: string[] = getGitHubRepository(dataset)
    const programmingLanguages: string[] = getProgrammingLanguages(dataset).filter(
        (language) => language !== ""
    ).map(
        (language) => language.toLowerCase()
    )

    return (
        <dialog id={dataset.id.toString()} className="modal">
            <div className="modal-box glass bg-black">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click on ✕ button to close</p>
            </div>
        </dialog>
    )
}