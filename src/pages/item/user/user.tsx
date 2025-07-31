import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../profile/profile.css'

import CardScroll from '../../../components/cards/card-scroll/CardScroll';
import FollowButton from '../../../components/assets/follow-button/FollowButton';
import FollowingDisplay from '../../../components/overlays/following-display/FollowingDisplay';
import UserInfo from '../../../components/assets/user-info/UserInfo';

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
    const [profile, setProfile] = useState<Profile | null>(null);
    const [followingUsers, setFollowingUsers] = useState<number[]>([]);
    const [followingMedia, setFollowingMedia] = useState<number[]>([]);
    const [viewFollowing, setViewFollowing] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

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

            fetch(`http://localhost:3000/follow/list/${user_id}/user`)
                .then(res => res.json())
                .then(data => setFollowingUsers(data.following))
                .catch(err => console.error('Failed to fetch following:', err));

            fetch(`http://localhost:3000/follow/list/${user_id}/media`)
                .then(res => res.json())
                .then(data => setFollowingMedia(data.following))
                .catch(err => console.error('Failed to fetch following:', err));
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

                    {/* Following Counts and Stuff */}
                    <div className='user-info'>
                    <UserInfo profile={profile} followingUsers={followingUsers} followingMedia={followingMedia} />
                </div>
                    
                {/* Hamburger Menu */}
                <button className='profile-hamburger' onClick={() => setMenuOpen(!menuOpen)}>
                    ⋮
                </button>
                    {menuOpen && (
                        <>
                            <div className={`profile-dropdown-menu ${menuOpen ? 'menu-open' : ''}`}>
                                <FollowButton style='small-button' type='user' followed_id={profile.user_id} />
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
            {viewFollowing && (<FollowingDisplay following={viewFollowing == 'user' ? followingUsers : followingMedia} type={viewFollowing} onClose={() => setViewFollowing('')} />)}
        </div>
    );
}

export default User;