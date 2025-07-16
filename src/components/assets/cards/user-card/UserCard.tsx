import React, { useEffect, useState } from 'react';
import './UserCard.css'

type CardProps = {
    cardStyle: string,
    id: number
}

const MediaCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [user_id, setUserID] = useState<number | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const loadCardData = async () => {
        var url = `http://localhost:3000/page/user/${id}`;

        try {
            var response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            setUserID(result.user_id);
            setUsername(result.username);
            setBio(result.bio);
        } catch (error) {
            console.error("Retrieve review error:", error);
            setUserID(-1);
            setUsername("Error");
            setBio("Error");
        }
    }

    useEffect(() => { loadCardData(); }, []);

    const routeToMedia = () => {
        console.log("button! :D");
    };

    return (
        <div className={cardStyle}>
            <div className='card-content'>
                <button className='card-media-name' onClick={routeToMedia}>{username}</button>
                <p className='card-description'>{bio}</p>
            </div>
        </div>
    );
};

export default MediaCard;