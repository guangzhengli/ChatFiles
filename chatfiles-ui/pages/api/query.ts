import type {NextApiRequest, NextApiResponse} from 'next'
import {getVectorStore} from "@/utils/vector";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning handler");

    const message: string = req.query.message as string;
    const indexName: string = req.query.indexName as string;

    console.log("handler chatfile query: ", message, indexName);
    const vectorStore = await getVectorStore([message], {fileName: indexName});

    const result = await vectorStore.similaritySearch(message, 1);
    console.log(result);
}

export default handler;