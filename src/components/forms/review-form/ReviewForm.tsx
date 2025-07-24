import React, { useState } from 'react';
import './ReviewForm.css';

type ReviewFormProps = {
    onClose: () => void;
    media: {
        media_id: number,
        media_name: string,
    }
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, media }) => {
    const [ rating, setRating ] = useState(0);
    const [ review_txt, setReview ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        var url = `http://localhost:3000/review`;

        const userStored = localStorage.getItem('user');
        if (!userStored) {
            setMessage('User not logged in.');
            return;
        }

        const user = JSON.parse(userStored);

        const user_id = user.user_id;
        const media_id = media.media_id;

        try {
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, media_id, rating, review_txt })
            };

            console.log({ user_id, media_id, rating, review_txt });
            var response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result) {
                setMessage('Review posted.');
            } else {
                setMessage('Review could not be posted.');
            }
        } catch (error) {
            console.error("Posting error:", error);
            setMessage("Could not connect to server. Please try again.");
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h2 className="section-title">Post a Review for<br></br><em>{media.media_name}</em></h2>
            <textarea
                maxLength={500}
                placeholder='review'
                value={review_txt}
                onChange={(e) => setReview(e.target.value)}
                required
            />
            <input //I want to make this a small star rating thing later - Jules
                type="number"
                min="1"
                max="5"
                placeholder="Rating (out of 5)"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
            />
            <button type="submit">Post Review</button>
            <button type="button" onClick={onClose}>Cancel</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ReviewForm;
