import React, { useState, useEffect } from 'react';

type Review = {
    review_id: number,
    user_id: number,
    username: string,
    media_id: number,
    media_name: string,
    rating: number,
    review_text: string,
}

const UserProfile: React.FC = () => {
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('item');
        if (stored) {
            const storedReview: Review = JSON.parse(stored);
            setReview(storedReview);

            fetch(`http://localhost:3000/review/${storedReview.media_id}`)
                .then(response => response.json())
                .then(data => {
                    setReview(data);
                })
                .catch(err => {
                    console.error('Failed to fetch item:', err);
                });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (!review) {
        return <p>This review could not be found.</p>;
    }

    return (
        <div className="review-page">
            <div className='review-content'>
                <h2 className='title'>Review of {review.media_name}</h2>
                <h4 className='user'>Posted by {review.username}</h4>
                <p className='review'>{review.review_text}</p>
                <h4 className='rating'>{review.rating}/5</h4>
            </div>
        </div>
    );
}

export default UserProfile;
