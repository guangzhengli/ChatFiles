import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import {EPubLoader} from "langchain/document_loaders/fs/epub";
import {DocxLoader} from "langchain/document_loaders/fs/docx";
import {TextLoader} from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {DocumentLoader} from "langchain/dist/document_loaders/base";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

export function getDocumentLoader(fileType: string, filePath: string): DocumentLoader {
    let loader;
    switch (fileType) {
        case "pdf":
            loader = new PDFLoader(filePath, {
                splitPages: false,
            });
            return loader;
        case "epub":
            loader = new EPubLoader(
                filePath, {
                    splitChapters: false,
                });
            return loader;
        case "docx":
            loader = new DocxLoader(
                filePath
            );
            return loader;
        case "txt":
            loader = new TextLoader(filePath);
            return loader;
        default:
            loader = new UnstructuredLoader(filePath);
            return loader;
    }
}

export function getDirectoryLoader(path: string): DocumentLoader {
    return new DirectoryLoader(
        path, {
            ".pdf": (path) => getDocumentLoader("pdf", path),
            ".epub": (path) => getDocumentLoader("epub", path),
            ".txt": (path) => getDocumentLoader("txt", path),
            ".docx": (path) => getDocumentLoader("docx", path),
        }
    );
}