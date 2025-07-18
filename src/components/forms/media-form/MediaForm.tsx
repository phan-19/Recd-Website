import React, { useState } from 'react';
import './MediaForm.css';

type MediaFormProps = {
    onClose: () => void;
};

const MediaForm: React.FC<MediaFormProps> = ({ onClose }) => {
    const [ media_name, setMediaName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ medium, setMedium ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        var url = `http://localhost:3000/media`;

        try {
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ media_name, description, medium })
            };

            console.log({ media_name, description, medium });
            var response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                setMessage('Media posted.');
            } else {
                setMessage('Media could not be posted.');
            }
        } catch (error) {
            console.error("Posting error:", error);
            setMessage("Could not connect to server. Please try again.");
        }
    };

    return (
        <form className="media-form" onSubmit={handleSubmit}>
            <h2 className="media-title">Post a New Item</h2>
            <input
                type="text"
                placeholder="Title"
                value={media_name}
                onChange={(e) => setMediaName(e.target.value)}
                required
            />
            <input
                type="text"
                maxLength={500}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <label htmlFor="medium">Medium:</label>
            <select name="medium" id="medium" onChange={(e) => setMedium(e.target.value)} required>
                <option value="Film">Movie</option>
                <option value="Show">Show</option>
                <option value="Book">Book</option>
                <option value="Misc">Other</option>
            </select>
            <button type="submit">Post Media</button>
            <button type="button" onClick={onClose}>Cancel</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default MediaForm;
