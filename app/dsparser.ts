import { Dataset, Field } from "./types";

export default function getCitationTitle(dataset: Dataset) {
    const citation = dataset.metadataBlocks.citation;
    const title = citation.fields.find((field: Field) => field.typeName === 'title');

    if (!title) {
        return '';
    }

    if (typeof title.value === 'string') {
        return title.value;
    }

    return ""
}

export function getKeywords(dataset: Dataset) {
    const citation = dataset.metadataBlocks.citation;
    const keywordCompound: Field | undefined = citation.fields.find(
        (field: Field) => field.typeName === 'keyword'
    );

    if (!keywordCompound || !Array.isArray(keywordCompound.value)) {
        return [];
    }

    const keywords: string[] = keywordCompound.value.map(
        (field: { [key: string]: Field }) => {

            const keywordValue: Field | undefined = field["keywordValue"]

            if (typeof keywordValue?.value === 'string') {
                return keywordValue.value.toLowerCase()
            }

            throw new Error('Keyword value is not a string')
        }
    )

    return keywords
}

export function getAuthors(dataset: Dataset) {
    const citation = dataset.metadataBlocks.citation;
    const authorCompound: Field | undefined = citation.fields.find(
        (field: Field) => field.typeName === 'author'
    );

    if (!authorCompound || !Array.isArray(authorCompound.value)) {
        return [];
    }

    const authors: string[] = authorCompound.value.map(
        (field: { [key: string]: Field }) => {

            const authorName: Field | undefined = field["authorName"]

            if (typeof authorName?.value === 'string') {
                return authorName.value
            }

            throw new Error('Author name is not a string')
        }
    )

    return authors
}

export function getGitHubRepository(dataset: Dataset) {
    if (!("CodeMeta" in dataset.metadataBlocks)) {
        return [""];
    }

    const codeMeta = dataset.metadataBlocks.CodeMeta;

    const repositoryField: Field | undefined = codeMeta.fields.find(
        (field: Field) => field.typeName === 'codeMetaCodeRepository'
    );

    if (!repositoryField) {
        return [""];
    }

    if (typeof repositoryField.value === 'string') {
        return [repositoryField.value];
    }

    if (Array.isArray(repositoryField.value)) {
        return repositoryField.value;
    } else {
        throw new Error('Repository field is not a string or array')
    }

}

export function getProgrammingLanguages(dataset: Dataset) {
    if (!("CodeMeta" in dataset.metadataBlocks)) {
        return [""];
    }

    const codeMeta = dataset.metadataBlocks.CodeMeta;

    const programmingLanguageField: Field | undefined = codeMeta.fields.find(
        (field: Field) => field.typeName === 'codeMetaProgrammingLanguage'
    );

    if (!programmingLanguageField) {
        return [""];
    }

    if (typeof programmingLanguageField.value === 'string') {
        return [programmingLanguageField.value];
    }

    if (Array.isArray(programmingLanguageField.value)) {
        return programmingLanguageField.value;
    } else {
        throw new Error('Programming language field is not a string or array')
    }
}
