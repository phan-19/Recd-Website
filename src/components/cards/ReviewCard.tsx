import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css'

import StarRating from '../assets/star-rating/StarRating'

type CardProps = {
    cardStyle: string,
    id: number
}

const ReviewCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [ user_id, setUserId ] = useState<number | null>(null);
    const [ username, setUsername ] = useState('');
    const [ profile_pic, setProfilePic ] = useState<number[]>([]);
    const [ media_id, setMediaId ] = useState<number | null>(null);
    const [ media_name, setMediaName ] = useState('');
    const [ medium, setMedium ] = useState('');
    const [ image, setImage ] = useState<number[]>([]);
    const [ rating, setRating ] = useState<number | null>(null);
    const [ review_txt, setReviewTxt ] = useState('');
    const [ posted_at, setPostedAt ] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadCardData = async () => {
        const url = `http://localhost:3000/card/review/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setUserId(result.user_id);
            setUsername(result.username);
            setProfilePic(result.profile_pic);
            setMediaId(result.media_id);
            setMediaName(result.media_name);
            setMedium(result.medium);
            setImage(result.image);
            setRating(result.rating);
            setReviewTxt(result.review_txt);
            setPostedAt(result.posted_at);
        } catch (error) {
            console.error('Retrieve review error:', error);
            setUserId(-1);
            setUsername('Error');
            setMediaId(-1);
            setMediaName('Error');
            setRating(-1);
            setReviewTxt('Error');
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
                <div className='card-rating'>
                    <StarRating rating={rating || 0} /> <span style={{marginLeft: '0.5rem'}}></span>
                </div>
                <p className='card-description'>{review_txt}</p>
            </div>
            <div className='card-content footer'>
                <p className='card-posted-at'>{posted_at}</p>
            </div>
        </div>
    );
};

export default ReviewCard;