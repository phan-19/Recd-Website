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
    profile_pic: number[];
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

    const displayImage = (image: number[]) => {
        const uint8Array = new Uint8Array(image);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // or 'image/png'
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    };

    return (
        <div className="profile overlay">
            <div className='profile-content overlay-component'>
                {profile.profile_pic.length > 0 && (
                    <img
                        src={displayImage(profile.profile_pic)}
                        alt={profile.username}
                        className={'profile-pic'}
                    />
                )}
                <h2 className='username'>{'@'}{profile.username}</h2>
                <p className='bio'>{profile.bio}</p>
                <button onClick={onClose}>Go Back</button>
            </div>
        </div>
    );
}

export default ProfileDisplay;
