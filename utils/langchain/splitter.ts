import { KeyConfiguration, ModelType } from "@/types";
import { Document } from "langchain/dist/document";
import { TokenTextSplitter } from "langchain/text_splitter";

export function getSplitterDocument(keyConfiguration: KeyConfiguration, documents: Document[]): Promise<Document[]> {
    const chunkSize = keyConfiguration.apiKey === ModelType.AZURE_OPENAI ? 4000 : 2000;
    const splitter = new TokenTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: 200,
    });
    return splitter.splitDocuments(documents);
}