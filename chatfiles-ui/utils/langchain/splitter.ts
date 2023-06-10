import {CharacterTextSplitter} from "langchain/text_splitter";
import {Document} from "langchain/dist/document";

export function getSplitterDocument(documents: Document[]): Promise<Document[]> {
    const splitter = new CharacterTextSplitter({
        chunkSize: 4000,
        chunkOverlap: 200,
    });
    return splitter.splitDocuments(documents);
}