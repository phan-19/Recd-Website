import React, { useState } from 'react';
import './MediaForm.css';

type MediaFormProps = {
    onClose: () => void;
};

const MediaForm: React.FC<MediaFormProps> = ({ onClose }) => {
    const [ media_name, setMediaName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ medium, setMedium ] = useState('');
    const [ image, setImage ] = useState<Array<number> | null>(null);
    const [ message, setMessage ] = useState('');

    const convertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                setImage(Array.from(byteArray));
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        var url = `http://localhost:3000/media`;

        try {
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({ 
                    media_name, 
                    description, 
                    medium, 
                    image: image ?? [] 
                })
            };

            console.log({ media_name, description, medium, image });
            var response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result) {
                setMessage(`Media ${result.media_id} posted.`);
            } else {
                setMessage('Media could not be posted.');
            }
        } catch (error) {
            console.error('Posting error:', error);
            setMessage('Could not connect to server. Please try again.');
        }
    };

    return (
        <form className='media-form' onSubmit={handleSubmit}>
            <h2 className='section-title'>Post a New Item</h2>
            <input
                type='text'
                placeholder='title'
                value={media_name}
                onChange={(e) => setMediaName(e.target.value)}
                required
            />
            <textarea
                maxLength={500}
                placeholder='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <label htmlFor='medium'>Medium:</label>
            <select name='medium' id='medium' onChange={(e) => setMedium(e.target.value)} required defaultValue={''}>
                <option value='' disabled>select one</option>
                <option value='movie'>Movie</option>
                <option value='show'>Show</option>
                <option value='book'>Book</option>
                <option value='misc'>Other</option>
            </select>
            <label htmlFor='image'>Image:</label>
            <input
                type='file'
                id='image'
                accept='image/*'
                onChange={convertImage}
            />
            <button type='submit'>Post Media</button>
            <button type='button' onClick={onClose}>Cancel</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default MediaForm;
