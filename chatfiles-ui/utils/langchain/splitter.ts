import {TokenTextSplitter} from "langchain/text_splitter";
import {Document} from "langchain/dist/document";
import {OPENAI_TYPE} from "@/utils/app/const";

const CHUNK_SIZE = OPENAI_TYPE === "Azure" ? 4000 : 2000;

export function getSplitterDocument(documents: Document[]): Promise<Document[]> {
    const splitter = new TokenTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: 200,
    });
    return splitter.splitDocuments(documents);
}