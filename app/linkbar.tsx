"use client";

import { BsGithub } from "react-icons/bs"
import { RiGitRepositoryLine } from "react-icons/ri"

const DATAVERSE_ROOT = 'https://darus.uni-stuttgart.de';

function TooltipLink(
    {
        children,
        text,
    }: {
        children: React.ReactNode,
        text: string,
    }
) {
    return (
        <div className="tooltip tooltip-primary scale-90" data-tip={text}>
            {children}
        </div>
    )
}

export default function LinkBar(
    {
        gitHubRepositories,
        persistentIdentifier,
    }: {
        gitHubRepositories: string[]
        persistentIdentifier: string
    }
) {

    // Metadata
    const dvLink = `${DATAVERSE_ROOT}/dataset.xhtml?persistentId=` + persistentIdentifier

    return (
        <div className="flex flex-row gap-2">
            {
                gitHubRepositories.length > 0 ?
                    <TooltipLink text="GitHub">
                        <a href={gitHubRepositories[0]} target="_blank">
                            <BsGithub size={21} />
                        </a>
                    </TooltipLink>
                    : null
            }
            <TooltipLink text="DaRUS">
                <a href={dvLink} target="_blank">
                    <RiGitRepositoryLine size={21} />
                </a>
            </TooltipLink>
        </div >
    )
}