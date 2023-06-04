import {SupabaseVectorStore} from "langchain/vectorstores/supabase";
import {createClient} from "@supabase/supabase-js";
import {Document} from "langchain/dist/document";
import {SUPABASE_KEY, SUPABASE_URL} from "@/utils/app/const";
import {getEmbeddings} from "@/utils/embeddings";


const client = createClient(SUPABASE_URL!, SUPABASE_KEY!);
export const getVectorStore = async (texts: string[], metadata: object) => {
    return await SupabaseVectorStore.fromTexts(texts, metadata, await getEmbeddings(),
        {
            client,
            tableName: "documents",
            queryName: "match_documents",
        }
    );
}

export const saveEmbeddings = async (documents: Document[]) => {
    const supabaseVectorStore = new SupabaseVectorStore(await getEmbeddings(),
        {client, tableName: "documents", queryName: "match_documents"});
    await supabaseVectorStore.addDocuments(documents);
}