import type {NextApiRequest, NextApiResponse} from 'next'
import fs from "fs";
import fetch from "node-fetch";
import FormData from 'form-data';
import {IncomingForm} from 'formidable';

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

    if (message && indexName) {
        const response = await fetch(`http://127.0.1:5001/query?message=${message}&indexName=${indexName}`, {
            method: 'Get'
        });

        const result = await response.text();
        res.status(200).json(result);
    }
}

export default handler;