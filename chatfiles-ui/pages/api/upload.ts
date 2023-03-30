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

    const fData = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
        const form = new IncomingForm({
            multiples: false
        })
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    });

    if (fData?.files.file) {
        const uploadFile = fData.files.file;
        const formData = new FormData();

        formData.append('file', fs.createReadStream(uploadFile.filepath), uploadFile.originalFilename)

        const response = await fetch('http://127.0.1:5001/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();

        res.status(200).json(result);
    }
}

export default handler;