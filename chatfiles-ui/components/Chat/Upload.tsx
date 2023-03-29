import {useRef, useState} from 'react';

export default function Upload() {
    const [isLoading, setIsLoading] = useState(false);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {

        /* Prevent form from submitting by default */
        e.preventDefault();

        /* If file is not selected, then show alert message */
        if (!inputFileRef.current?.files?.length) {
            alert('Please, select file you want to upload');
            return;
        }

        setIsLoading(true);

        /* Add files to FormData */
        const formData = new FormData();
        Object.values(inputFileRef.current.files).forEach(file => {
            formData.append('file', file);
        })

        /* Send request to our api route */
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const body = await response.json() as { status: 'ok' | 'fail', message: string };

        alert(body.message);

        if (body.status === 'ok') {
            inputFileRef.current.value = '';
            // Do some stuff on successfully upload
        } else {
            alert('upload failed');
        }

        setIsLoading(false);
    };


    return (
        <form>
            <div>
                <input type="file" name="myfile" ref={inputFileRef} multiple />
            </div>
            <div>
                <input type="submit" value="Upload" disabled={isLoading} onClick={handleOnClick} />
                {isLoading && ` Wait, please...`}
            </div>
        </form>
    )
}