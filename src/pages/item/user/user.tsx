import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './user.css'

import Button from '../../../components/assets/button/Button'
import CardScroll from '../../../components/cards/card-scroll/CardScroll';

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

const User: React.FC = () => {
    const [ profile, setProfile ] = useState<Profile | null>(null);
    const [ menuOpen, setMenuOpen ] = useState(false);

    
    const { user_id } = useParams();
    
    useEffect(() => {
        if (user_id) {
            fetch(`http://localhost:3000/page/user/${user_id}`)
                .then(response => response.json())
                .then(data => {
                    setProfile(data);
                })
                .catch(err => {
                    console.error('Failed to fetch profile:', err);
                });
        } 
    }, []);

    const getProfilePicSrc = (bytes: number[]) => {
        const uint8Array = new Uint8Array(bytes);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        return `data:image/png;base64,${base64String}`; // or image/jpeg, depending on your data
    };

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
                    <button className='profile-hamburger' onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>
                    {menuOpen && (
                        <>
                            <div className={`profile-dropdown-menu ${menuOpen ? 'menu-open' : ''}`}>
                                {/* <Button
                                    buttonStyle='small-button'
                                    buttonText='Edit Profile'
                                    onClick={() => {
                                        setEditProfile(true);
                                    }}
                                />
                                <Button
                                    buttonStyle='small-button'
                                    buttonText='Logout'
                                    onClick={() => {
                                        handleLogout();
                                    }}
                                /> */}
                            </div>
                        </>
                    )}
                </div>
                <p className='bio '>{profile.bio}</p>
            </div>
            <div>
                <h2 className='section-title'>{profile.username}'s Reviews</h2>
                <CardScroll ids={profile.reviews} card_type='review' />
            </div>
        </div>
    );
}

export default User;