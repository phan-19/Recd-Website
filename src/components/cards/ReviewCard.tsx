import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css'

type CardProps = {
    cardStyle: string,
    id: number
}

const ReviewCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [user_id, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState("");
    const [media_id, setMediaId] = useState<number | null>(null);
    const [media_name, setMediaName] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [review_txt, setReviewTxt] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadCardData = async () => {
        const url = `http://localhost:3000/review/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setUserId(result.user_id);
            setUsername(result.username);
            setMediaId(result.media_id);
            setMediaName(result.media_name);
            setRating(result.rating);
            setReviewTxt(result.review_txt);
        } catch (error) {
            console.error("Retrieve review error:", error);
            setUserId(-1);
            setUsername("Error");
            setMediaId(-1);
            setMediaName("Error");
            setRating(-1);
            setReviewTxt("Error");
        }};
        loadCardData();
    }, [id]);

    const handleMediaClick = () => {
        navigate(`/media/${media_id}`, {
            state: { backgroundLocation: location },
        });
    };

    const handleUserClick = () => {
        navigate(`/user/${user_id}`, {
            state: { backgroundLocation: location },
        });
    };

    return (
        <div className={cardStyle}>
            <div className='card-content'>
                <button className='card-media-name' onClick={handleMediaClick}>{media_name}</button>
                <h4 className='card-username'>Review by: {' '}
                    <button className='card-username-button' onClick={handleUserClick}>{username}</button>
                </h4>
                <p className='card-rating'>{rating}/5</p>
                <p className='card-description'>{review_txt}</p>
            </div>
        </div>
    );
};

export default ReviewCard;