import {SupabaseFilterRPCCall, SupabaseVectorStore} from "langchain/vectorstores/supabase";
import {createClient} from "@supabase/supabase-js";
import {Document} from "langchain/dist/document";
import {OPENAI_TYPE, SUPABASE_KEY, SUPABASE_URL} from "@/utils/app/const";
import {getEmbeddings} from "@/utils/embeddings";
import { KeyConfiguration, ModelType } from "@/types";


const client = createClient(SUPABASE_URL!, SUPABASE_KEY!);

export const getVectorStore = async (keyConfiguration: KeyConfiguration, texts: string[], metadata: object) => {
    return await SupabaseVectorStore.fromTexts(texts, metadata, await getEmbeddings(keyConfiguration),
        {
            client,
            tableName: "documents",
            queryName: "match_documents",
        }
    );
}

export const getExistingVectorStore = async (keyConfiguration: KeyConfiguration, fileName: string) => {
    const fileNameFilter: SupabaseFilterRPCCall = (rpc) =>
        rpc.filter("metadata->>file_name", "eq", fileName);
    return await SupabaseVectorStore.fromExistingIndex(await getEmbeddings(keyConfiguration),
        {
            client,
            tableName: "documents",
            queryName: "match_documents",
            filter: fileNameFilter
        }
    );
}

export const saveEmbeddings = async (keyConfiguration: KeyConfiguration, documents: Document[]) => {
    const supabaseVectorStore = new SupabaseVectorStore(await getEmbeddings(keyConfiguration),
        {client, tableName: "documents", queryName: "match_documents"});

    // wait for https://github.com/hwchase17/langchainjs/pull/1598 to be released
    if (keyConfiguration.apiType === ModelType.AZURE_OPENAI) {
        for (const doc of documents) {
            await supabaseVectorStore.addDocuments([doc]);
        }
    } else {
        await supabaseVectorStore.addDocuments(documents);
    }

}