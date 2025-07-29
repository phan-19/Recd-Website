import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css';

type CardProps = {
    cardStyle: string;
    id: number;
};

const MediaCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [ media_id, setMediaId ] = useState<number | null>(null);
    const [ media_name, setMediaName ] = useState('');
    const [ medium, setMedium ] = useState('');
    const [ image, setImage ] = useState<number[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadCardData = async () => {
        const url = `http://localhost:3000/card/media/${id}`;
        const response = await fetch(url);
        const text = await response.text();

        try {
            const result = JSON.parse(text); // parse manually to catch errors
            setMediaId(result.media_id);
            setMediaName(result.media_name);
            setMedium(result.medium);
            setImage(result.image);
        } catch (err) {
            console.error('Failed to parse JSON:', text);
            throw err;
        }};
        loadCardData();
    }, [id]);

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // or 'image/png'
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    };

    const handleMediaClick = () => {
        navigate(`/media/${media_id}/preview`, {
            state: { backgroundLocation: location },
        });
    };

    return (
        <div className={cardStyle}>
            {image.length > 0 && (
                <img
                    src={displayImage(image)}
                    alt={media_name}
                    className={'card-image'}
                />
            )}
            <div className='card-content'>
                <button className='card-media-name' onClick={handleMediaClick}>{media_name}</button>
                <p className='card-type'><em>{medium}</em></p>
            </div>
        </div>
    );
};

export default MediaCard;
