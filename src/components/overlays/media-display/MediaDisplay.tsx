import React, { useState, useEffect } from 'react';
import './MediaDisplay.css'

import ReviewForm from '../../forms/review-form/ReviewForm'

type MediaDisplayProps = {
    onClose: () => void;
    media_id: number;
};

type Media = {
    media_id: number;
    media_name: string;
    medium: string;
    reviews: [];
    description: string;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ onClose, media_id }) => {
    const [media, setMedia] = useState<Media | null>(null);
    const [writingReview, setWritingReview] = useState(false);

    useEffect(() => {
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

    const toggleWriteReview = () => {
        setWritingReview(!writingReview);
    };

    return (
        <div className="media-page overlay">
            <div className='media-content overlay-component'>
                <h2 className='title'>{media.media_name}</h2>
                <h4 className='medium'>{media.medium}</h4>
                <p className='description'>{media.description}</p>
                <button type="button" onClick={toggleWriteReview}>Post a Review</button>
                <button type='button' onClick={onClose}>Go Back</button>
            </div>
            {writingReview && (
                <div className='overlay'>
                    <div className='overlay-component'>
                        <ReviewForm onClose={toggleWriteReview} media={media} />
                    </div>
                </div>
            )}
            <div>
                {/* Review scroll here - Feeling lazy rn */}
            </div>
        </div>
    );
}

export default MediaDisplay;
