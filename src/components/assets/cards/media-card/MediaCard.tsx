import React, { useEffect, useState } from 'react';
import './MediaCard.css'

type CardProps = {
    cardStyle: string,
    id: number
}

const MediaCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [media_id, setMediaId] = useState<number | null>(null);
    const [media_name, setMediaName] = useState("");
    const [medium, setMedium] = useState("");
    const [description, setDescription] = useState("");

    const loadCardData = async () => {
        var url = `http://localhost:3000/page/media/${id}`;

        try {
            var response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            setMediaId(result.media_id);
            setMediaName(result.media_name);
            setMedium(result.medium);
            setDescription(result.description);

        } catch (error) {
            console.error("Retrieve review error:", error);
            setMediaId(-1);
            setMediaName("Error");
            setMedium("Error");
            setDescription("Error");
        }
    }

    useEffect(() => { loadCardData(); }, []);

    const routeToMedia = () => {
        console.log("button! :D");
    };

    return (
        <div className={cardStyle}>
            <div className='card-content'>
                <button className='card-media-name' onClick={routeToMedia}>{media_name}</button>
                <p className='card-rating'>{medium}</p>
                <p className='card-description'>{description}</p>
            </div>
        </div>
    );
};

export default MediaCard;