import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css';

type CardProps = {
    cardStyle: string;
    id: number;
};

const MediaCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [media_name, setMediaName] = useState("");
    const [medium, setMedium] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadCardData = async () => {
        const url = `http://localhost:3000/page/media/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setMediaName(result.media_name);
            setMedium(result.medium);
            setDescription(result.description);

        } catch (error) {
            console.error("Retrieve media error:", error);
            setMediaName("Error");
            setMedium("Error");
            setDescription("Error");
        }};
        loadCardData();
    }, [id]);

    const handleMediaClick = () => {
        navigate(`/media/${id}`, {
            state: { backgroundLocation: location },
        });
    };

    return (
        <div className={cardStyle}>
            <div className="card-content">
                <button className="card-media-name" onClick={handleMediaClick}>{media_name}</button>
                <p className="card-rating">{medium}</p>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

export default MediaCard;
