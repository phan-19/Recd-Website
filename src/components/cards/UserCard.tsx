import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Card.css'

type CardProps = {
    cardStyle: string,
    id: number
}

const UserCard: React.FC<CardProps> = ({ cardStyle, id }) => {
    const [ user_id, setUserID ] = useState<number | null>(null);
    const [ username, setUsername ] = useState('');
    const [ bio, setBio ] = useState('');
    const [ profile_pic, setProfilePic ] = useState<number[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    const loadCardData = async () => {
        var url = `http://localhost:3000/card/user/${id}`;

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
            console.error('Retrieve review error:', error);
            setUserID(-1);
            setUsername('Error');
            setBio('Error');
        }
    }

    useEffect(() => { loadCardData(); }, []);

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // or 'image/png'
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    };

    const routeToUser = () => {
        navigate(`/user/${user_id}`, {
            state: { backgroundLocation: location },
        });
    };

    return (
        <div className={cardStyle}>
            <div className='card-content'>
                {profile_pic.length > 0 && (
                    <img
                        src={displayImage(profile_pic)}
                        alt={username}
                        className={'profile-pic'}
                    />
                )}
                <button className='card-media-name' onClick={routeToUser}>{username}</button>
                <p className='card-description'>{bio}</p>
            </div>
        </div>
    );
};

export default UserCard;