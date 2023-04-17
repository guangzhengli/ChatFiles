import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from "node-fetch";
import {CHAT_FILES_SERVER_HOST} from "@/utils/app/const";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning handler");

    const message: string = req.query.message as string;
    const indexName: string = req.query.indexName as string;
    const indexType: string = req.query.indexType as string;

    console.log("handler chatfile query: ", message, indexName);

    if (message && indexName) {
        const response = await fetch(`${CHAT_FILES_SERVER_HOST}/query?message=${message}&indexName=${indexName}&indexType=${indexType}`, {
            method: 'Get'
        });

        const result = await response.text();
        res.status(200).json(result);
    }
}

export default handler;