import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import fetch from "node-fetch";
import FormData from 'form-data';
import formidable, { File } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', (field: any, file: any) => {
            files.push([field, file]);
        });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    if (files?.length) {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file[0], fs.createReadStream(file[1].filepath));
        }

        const response = await fetch('http://localhost:5000/upload', {
            headers: formData.getHeaders(),
            method: 'POST',
            body: formData
        });

        res.status(200).json(await response.json());
    }
}

export default handler;