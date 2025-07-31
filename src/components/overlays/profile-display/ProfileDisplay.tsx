import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDisplay.css';

import Button from '../../assets/button/Button';
import FollowButton from '../../assets/follow-button/FollowButton';

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

    const navigate = useNavigate();

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

    const getProfilePicSrc = (bytes: number[]) => {
        const uint8Array = new Uint8Array(bytes);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        return `data:image/png;base64,${base64String}`; // or image/jpeg, depending on your data
    };

    const openPage = () => {
        navigate(`/user/${user_id}`);
    };

    return (
        <div className="profile overlay">
            <div className='profile-content overlay-component'>
                <div className='profile-header'>
                    {profile.profile_pic.length > 0 && (
                        <img
                            src={getProfilePicSrc(profile.profile_pic)}
                            alt={`${profile.username}'s profile`}
                            className="profile-pic"
                        />
                    )}
                    <h2 className='username'>{'@'}{profile.username}</h2>

                </div>
                <p className='bio'>{profile.bio}</p>
                <div className='popup-buttons'>
                    <Button buttonStyle='small-button' buttonText='Visit' onClick={openPage} />
                    <FollowButton style='small-button' type='user' followed_id={profile.user_id} />
                    <Button buttonStyle='small-button' buttonText='Exit' onClick={onClose} />
                </div>
            </div>
        </div>
    );
}

export default ProfileDisplay;
