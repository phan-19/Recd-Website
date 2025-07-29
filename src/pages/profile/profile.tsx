import React, { useState, useEffect } from 'react';
import './profile.css'

import CardScroll from '../../components/cards/card-scroll/CardScroll';

type User = {
    user_id: number,
    username: string,
};

type Profile = {
    user_id: number,
    username: string,
    bio: string,
    profile_pic: number[],
    reviews: number[],
}

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [followedUsers, setFollowedUsers] = useState<number[]>([]);
    const [followedMedia, setFollowedMedia] = useState<number[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const storedUser: User = JSON.parse(stored);
            setUser(storedUser);

            fetch(`http://localhost:3000/page/user/${storedUser.user_id}`)
                .then(response => response.json())
                .then(data => {
                    setProfile(data);
                })
                .catch(err => {
                    console.error('Failed to fetch profile:', err);
                });

            fetch(`http://localhost:3000/follow/list/${storedUser.user_id}/user`)
                .then(response => response.json())
                .then(result => { setFollowedUsers(result.following) })
                .catch(err => { console.error("Failed to fetch followed users:", err) });
            fetch(`http://localhost:3000/follow/list/${storedUser.user_id}/media`)
                .then(response => response.json())
                .then(result => { setFollowedMedia(result.following) })
                .catch(err => { console.error("Failed to fetch followed users:", err) });
        }
    }, []);

    const getProfilePicSrc = (bytes: number[]) => {
        const uint8Array = new Uint8Array(bytes);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        return `data:image/png;base64,${base64String}`; // or image/jpeg, depending on your data
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setProfile(null);
        window.location.reload();
    };

    if (!user) {
        return <p>No user found on local device.</p>;
    }

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile user">
            <div className='profile-content'>
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

                <p className='bio '>{profile.bio}</p>
                <button onClick={handleLogout}>Log Out</button>
            </div>
            <div>
                <h2 className='section-title'>Your Reviews</h2>
                <CardScroll ids={profile.reviews} card_type='review' />
            </div>
            <div>
                <h2 className='section-title'>Followed Users</h2>
                <CardScroll ids={followedUsers} card_type='user' />
            </div>
            <div>
                <h2 className='section-title'>Followed Media</h2>
                <CardScroll ids={followedMedia} card_type='media' />
            </div>
        </div >
    );
}

export default UserProfile;