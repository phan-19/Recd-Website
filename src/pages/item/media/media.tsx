import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './media.css';

import ReviewForm from '../../../components/forms/review-form/ReviewForm';
import CardScroll from '../../../components/cards/card-scroll/CardScroll';

type Media = {
    media_id: number;
    media_name: string;
    description: string;
    medium: string;
    image: Array<number> | [];
    reviews: number[];
    tags: string[];
};

const Media: React.FC = () => {
    const [media, setMedia] = useState<Media | null>(null);
    const [writingReview, setWritingReview] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { media_id } = useParams();

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

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    const toggleWriteReview = () => {
        setWritingReview(!writingReview);
    };

    if (!media) {
        return (
            <div className="media-page overlay">
                <div className='media-content overlay-component'>
                    <p>Media not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="media-page">
            <div className="media-content">
                <div className="media-header">
                    <button className="media-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>
                    {menuOpen && (
                        <div className="media-dropdown-menu">
                            {/* Dropdown items here */}
                        </div>
                    )}

                    <div className="media-image-wrapper">
                        {media.image.length > 0 && (
                            <img
                                src={displayImage(media.image)}
                                alt={`${media.media_name} cover`}
                                className="media-image"
                            />
                        )}
                    </div>

                    <h2 className="title">{media.media_name}</h2>
                </div>

                <h4 className="medium"><em>{media.medium}</em></h4>
                <p className="description">{media.description}</p>
                <button type="button" onClick={toggleWriteReview}>Post a Review</button>
            </div>

            <div>
                <h2 className="section-title">{media.media_name} Reviews</h2>
                <CardScroll ids={media.reviews} card_type="review" />
            </div>

            {writingReview && (
                <div className="overlay">
                    <div className="overlay-component">
                        <ReviewForm onClose={toggleWriteReview} media={media} />
                    </div>
                </div>
            )}
        </div>

    );
};

export default Media;

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

    return (
        <div className='media-page'>
            <div>
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
                <button type="button" onClick={toggleWriteReview}>Post a Review</button>
                <div>
                    <CardScroll ids={media.reviews} card_type='review' />
                </div>
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

export default Media;
