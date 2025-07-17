import React, { useState, useEffect } from 'react';
import './ProfileDisplay.css';

type ProfileDisplayProps = {
    onClose: () => void,
    user_id: number,
}

type Profile = {
    user_id: number,
    username: string,
    bio: string,
    reviews: number[],
};

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ onClose, user_id }) => {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/page/user/${user_id}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch media');
                return response.json();
            })
            .then(data => {
                setProfile(data);
            })
            .catch(err => {
                console.error('Failed to fetch item:', err);
                setProfile(null);
            });
    }, [user_id]);

    if (!profile) {
        return <p>This profile could not be found.</p>;
    }

    return (
        <div className="profile overlay other">
            <div className='profile-content overlay-component other'>
                <h2 className='username other'>{'@'}{profile.username}</h2>
                <p className='bio other'>{profile.bio}</p>
                <button onClick={onClose}>Go Back</button>
            </div>
        </div>
    );
}

export default ProfileDisplay;
