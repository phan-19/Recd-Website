import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MediaDisplay.css'

import ReviewForm from '../../forms/review-form/ReviewForm'

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

    const navigate = useNavigate();

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

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // or 'image/png'
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
        <div className="media-page overlay">
            <div className='media-content overlay-component'>
                {media.image.length > 0 && (
                    <img
                        src={displayImage(media.image)}
                        alt={media.media_name}
                        className={'media-image'}
                    />
                )}
                <h2 className='title'>{media.media_name}</h2>
                <h4 className='medium'><em>{media.medium}</em></h4>
                <p className='description'>{media.description}</p>
                <button type='button' onClick={openPage}>Visit</button>
                <button type="button" onClick={toggleWriteReview}>Post a Review</button>
                <button type='button' onClick={onClose}>Go Back</button>
                {/* <div>
                    <CardScroll ids={media.reviews} card_type='review' />
                </div> */}
            </div>
            {writingReview && (
                <div className='overlay'>
                    <div className='overlay-component'>
                        <ReviewForm onClose={toggleWriteReview} media={media} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MediaDisplay;
