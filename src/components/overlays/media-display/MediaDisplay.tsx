import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MediaDisplay.css'

import Button from '../../assets/button/Button';
import ReviewForm from '../../forms/review-form/ReviewForm';
import FollowButton from '../../assets/follow-button/FollowButton';

type MediaDisplayProps = {
    onClose: () => void;
    media_id: number;
};

type Media = {
    media_id: number;
    media_name: string;
    description: string;
    medium: string;
    image: Array<number> | [];
    reviews: number[];
    tags: string[];
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ onClose, media_id }) => {
    const [media, setMedia] = useState<Media | null>(null);
    const [writingReview, setWritingReview] = useState(false);
    const [user_id, setUserId] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userStored = localStorage.getItem('user');
        if (userStored) {
            const user = JSON.parse(userStored);
            setUserId(user.user_id);
        }
        
        fetch(`http://localhost:3000/page/media/${media_id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch media');
                return response.json();
            })
            .then(data => {
                setMedia(data);
            })
            .catch(err => {
                console.error('Failed to fetch item:', err);
                setMedia(null);
            });
    }, [media_id]);

    if (!media) {
        return (
            <div className="media-page overlay">
                <div className='media-content overlay-component'>
                    <p>Media not found.</p>
                    <button type='button' onClick={onClose}>Go Back</button>
                </div>
            </div>
        );
    }

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    };

    const toggleWriteReview = () => {
        setWritingReview(!writingReview);
    };

    const openPage = () => {
        navigate(`/media/${media_id}`);
    };


    return (
        <div className="overlay">
            <div className='media-content'>
                <div className='body'>
                    <div className='media-text'>
                        <h2 className='section-title'>{media.media_name}</h2>
                        <h4 className='medium'><em>- {media.medium} -</em></h4>
                        <p className='description'>{media.description}</p>
                    </div>
                    {media.image.length > 0 && (
                        <img
                            src={displayImage(media.image)}
                            alt={media.media_name}
                            className={'media-image'}
                        />
                    )}
                </div>
                <div className='buttons'>
                    <Button buttonStyle='small-button' buttonText='Visit' onClick={openPage} />
                    {user_id && <FollowButton style='small-button' type='media' followed_id={user_id} />}
                    <Button buttonStyle='small-button' buttonText='Review' onClick={toggleWriteReview} />
                    <Button buttonStyle='small-button' buttonText='Exit' onClick={onClose} />
                </div>
            </div>
            {writingReview && (
                <div className='overlay'>
                    <div className=''>
                        <ReviewForm onClose={toggleWriteReview} media={media} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MediaDisplay;
