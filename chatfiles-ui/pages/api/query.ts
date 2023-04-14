import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from "node-fetch";
import { CHAT_FILES_SERVER_HOST } from "@/utils/app/const";

export const config = {
    api: {
        bodyParser: false,
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning GET handler");
    const message: string = req.query.message as string;
    const indexNames: string = req.query.indexNames as string;

    console.log("handler chatfile query: ", message, indexNames);

    if (message && indexNames) {
        const indexNamesArray = indexNames.split(",");
        const indexNamesParam = indexNamesArray.join(",");
        const response = await fetch(`${CHAT_FILES_SERVER_HOST}/query?message=${message}&indexNames=${indexNamesParam}`, {
            method: 'Get'
        });

        const result = await response.text();
        res.status(200).json(result);
    }
}



export default handler;