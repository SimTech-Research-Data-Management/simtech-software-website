"use client";

import { Dataset } from "./types";
import LinkBar from "./linkbar";
import getCitationTitle, {
  getAuthors,
  getGitHubRepository,
  getKeywords,
  getProgrammingLanguages,
  getDescriptions,
} from "./dsparser";

const DATAVERSE_URL = "https://darus.uni-stuttgart.de";

function Tag({ name, style }: { name: string; style: string }) {
  return <div className={`text-md badge badge-lg ${style}`}>{name}</div>;
}

export default function Card({ dataset }: { dataset: Dataset }) {
  // Metadata
  const datasetURL: string =
    `${DATAVERSE_URL}/dataset.xhtml?persistentId=` +
    dataset.datasetPersistentId;
  const datasetTitle: string = getCitationTitle(dataset);
  const datasetDescription: string = getDescriptions(dataset);
  const keywords: string[] = getKeywords(dataset).sort();
  const authors: string[] = getAuthors(dataset);
  const gitHubRepositories: string[] = getGitHubRepository(dataset);
  const programmingLanguages: string[] = getProgrammingLanguages(dataset)
    .filter((language) => language !== "")
    .map((language) => language.toLowerCase());

  let authorsString: string;

  if (authors.length > 3) {
    authorsString = authors.slice(0, 3).join("; ") + " et al.";
  } else {
    authorsString = authors.join("; ");
  }

  console.log(datasetDescription);

  // Components
  const keywordsComponents = keywords.map((keyword, index) => (
    <Tag
      style="bg-neutral text-base-100 text-sm border-0"
      key={"kw" + index.toString()}
      name={keyword}
    />
  ));

  const languageComponents = programmingLanguages.map((language, index) => (
    <Tag
      style="badge-primary text-white text-sm border-0"
      key={"lang" + index.toString()}
      name={language}
    />
  ));

  return (
    <div className="card border-b-[2px] border-b-slate-400 shadow-xl m-4 h-auto card-normal hover:-translate-y-[4px] bg-white duration-300 my-2 gap-y-1">
      <div className="card-body">
        <div className="flex flex-row justify-between text-base-100">
          <p className="card-text text-base-100/70">{authorsString}</p>
          <LinkBar
            gitHubRepositories={gitHubRepositories}
            persistentIdentifier={dataset.datasetPersistentId}
          />
        </div>
        <h2
          className="card-title text-base-100 text-2xl"
          onClick={() => {
            window.open(datasetURL);
          }}
        >
          {datasetTitle}
        </h2>
        <p className="card-text mb-3 mt-1 text-base-100 font-light text-md text-justify">
          {datasetDescription.trim()}
        </p>
        <div className="card-actions">
          <div className="flex flex-wrap gap-3 mt-2">
            {languageComponents}
            {keywordsComponents}
          </div>
        </div>
      </div>
    </div>
  );
}
