import type {NextApiRequest, NextApiResponse} from 'next'
import multer from "multer";

export const config = {
    api: {
        bodyParser: false,
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}.${file.originalname.split('.').pop()}`);
        },
    }),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("beginning handler");

    upload.single('file')(req as any, res as any, (err: any) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // File uploaded successfully
        res.status(200).json({ message: 'File uploaded successfully' });
    });
}

export default handler;