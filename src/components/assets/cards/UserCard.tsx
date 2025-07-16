import React, { useEffect, useState } from 'react';
import './Card.css'

type CardProps = {
    cardStyle: string,
    id: number
}

const UserCard: React.FC<CardProps> = ({ cardStyle, id }) => {
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

    const routeToUser = () => {
        console.log('button');
        const item = {
            user_id: user_id,
            type: 'user',
        }
        localStorage.setItem('item', JSON.stringify(item));
        window.location.reload();
    };

    return (
        <div className={cardStyle}>
            <div className='card-content'>
                <button className='card-media-name' onClick={routeToUser}>{username}</button>
                <p className='card-description'>{bio}</p>
            </div>
        </div>
    );
};

export default UserCard;