import React, { useState } from 'react';
import './ReviewPost.css';

type User = {
    user_id: number
}

type Media = {
    media_id: number,
    media_name: string,
}

const ReviewPost: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [media, setMedia] = useState<Media | null>(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        var url = `http://66.231.155.18:3000/review/`;

        var stored = localStorage.getItem('user');
        if (stored) {
            const storedUser: User = JSON.parse(stored);
            setUser(storedUser);
        } else {
            return <p>Error retrieving current user.</p>
        }

        const user_id = user?.user_id;

        stored = null;

        stored = localStorage.getItem('media');
        if (stored) {
            const storedMedia: Media = JSON.parse(stored);
            setMedia(storedMedia);
        } else {
            return <p>Error retrieving current media.</p>;
        }

        const media_id = media?.media_id;

        try {
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, media_id, rating, review })
            };

            var response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
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
            <h2 className="review-title">Post a Review for ${media?.media_name}</h2>
            <input
                type="text"
                placeholder="review text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
            />
            <input //I want to make this a small star rating thing later - Jules
                type="number"
                placeholder="Rating (out of 5)"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
            />
            <button type="submit">Post Review</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ReviewPost;
