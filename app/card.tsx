"use client";

import { Dataset } from "./types"
import getCitationTitle, { getAuthors, getGitHubRepository, getKeywords, getProgrammingLanguages } from "./dsparser"
import LinkBar from "./linkbar";

const DATAVERSE_URL = 'https://darus.uni-stuttgart.de';

function Tag(
    {
        name,
        style,
    }: {
        name: string
        style: string
    }
) {
    return (
        <div className={`badge badge-sm ${style}`}>{name}</div>
    )
}

export default function Card(
    {
        dataset
    }: {
        dataset: Dataset
    }
) {

    // Metadata
    const datasetURL: string = `${DATAVERSE_URL}/dataset.xhtml?persistentId=` + dataset.datasetPersistentId
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

    // Components
    const keywordsComponents = keywords.map((keyword, index) => (
        <Tag style="badge-primary" key={"kw" + index.toString()} name={keyword} />
    ));

    const languageComponents = programmingLanguages.map((language, index) => (
        <Tag style="bg-slate-100 text-gray-800 border-0" key={"lang" + index.toString()} name={language} />
    ));

    return (
        <div
            className="card m-4 w-auto h-34 glass card-compact hover:scale-105 hover:bg-neutral-800 duration-500 my-4 gap-y-2"
        >
            <div className="card-body">
                <div className="flex flex-row justify-between">
                    <p
                        className="card-text"
                    >
                        {authorsString}
                    </p>
                    <LinkBar
                        gitHubRepositories={gitHubRepositories}
                        persistentIdentifier={dataset.datasetPersistentId}
                    />
                </div>
                <h2
                    className="card-title"
                    onClick={() => { window.open(datasetURL) }}
                >
                    {datasetTitle}
                </h2>
                <div className="card-actions">
                    <div className="flex flex-wrap gap-1">
                        {languageComponents} {keywordsComponents}
                    </div>
                </div>
            </div>
        </div>
    )
}