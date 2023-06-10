import type {NextApiRequest, NextApiResponse} from 'next'
import {getExistingVectorStore} from "@/utils/vector";
import {getModel} from "@/utils/openai";
import {loadQAStuffChain} from "langchain/chains";

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
    const vectorStore = await getExistingVectorStore(indexName);

    const documents = await vectorStore.similaritySearch(message, 2);
    const model = await getModel();
    const stuffChain = loadQAStuffChain(model);

    try {
        const chainValues = await stuffChain.call({
            input_documents: documents,
            question: message,
        });
        res.status(200).json({ responseMessage: chainValues.text.toString() });
    } catch (e) {
        console.log("error in handler: ", e);
        res.status(500).json({ responseMessage: (e as Error).toString() });
    }

}

export default handler;