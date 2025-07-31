import React, { useState, useEffect } from 'react';
import './profile.css';

import Button from '../../components/assets/button/Button';
import CardScroll from '../../components/cards/card-scroll/CardScroll';
import FollowingDisplay from '../../components/overlays/following-display/FollowingDisplay';
import ToDoDisplay from '../../components/overlays/todo-display/TodoDisplay';

type User = {
  user_id: number;
  username: string;
};

type Profile = {
  user_id: number;
  username: string;
  bio: string;
  profile_pic: number[];
  reviews: number[];
};

type MediaRes = {
  result: number[];
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followingUsers, setFollowingUsers] = useState<number[]>([]);
  const [followingMedia, setFollowingMedia] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [viewFollowing, setViewFollowing] = useState('');
  const [viewTodo, setViewTodo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const storedUser: User = JSON.parse(stored);
      setUser(storedUser);

      fetch(`http://localhost:3000/page/user/${storedUser.user_id}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error('Failed to fetch profile:', err));

      fetch(`http://localhost:3000/follow/list/${storedUser.user_id}/user`)
        .then(res => res.json())
        .then(data => setFollowingUsers(data.following))
        .catch(err => console.error('Failed to fetch following:', err));

      fetch(`http://localhost:3000/follow/list/${storedUser.user_id}/media`)
        .then(res => res.json())
        .then(data => setFollowingMedia(data.following))
        .catch(err => console.error('Failed to fetch following:', err));
    }
  }, []);

  const getProfilePicSrc = (bytes: number[]) => {
    const uint8Array = new Uint8Array(bytes);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return `data:image/png;base64,${base64String}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
    window.location.reload();
  };

  if (!user) return <p>No user found on local device.</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
      <div className='profile user'>
        <div className='profile-content'>
          <div className='profile-header'>
            {/* Profile Picture */}
            {profile.profile_pic.length > 0 && (
              <img
                src={getProfilePicSrc(profile.profile_pic)}
                alt={`${profile.username}'s profile`}
                className='profile-pic'
              />
            )}

            {/* Username */}
            <h2 className='username'>@{profile.username}</h2>

            {/* Following Counts and Stuff */}
            <div className='user-info'>
              <div className='count' style={{ textAlign: 'center', display: 'grid', margin: 0 }}>
                <button>
                  Posted<br/>
                  <strong>{profile.reviews.length}</strong>
                  {profile.reviews.length === 1 ? ' Review' : ' Reviews'}
                </button>
              </div>
              <div className='count' style={{ textAlign: 'center', display: 'grid', margin: 0 }}>
                <button onClick={() => setViewFollowing('user')}>
                  Follows<br/>
                  <strong>{followingUsers.length}</strong>
                  {followingUsers.length === 1 ? ' User' : ' Users'}
                </button>
              </div>
              <div className='count' style={{ textAlign: 'center', display: 'grid', margin: 0 }}>
                <button onClick={() => setViewFollowing('media')}>
                  Follows<br/>
                  <strong>{followingMedia.length}</strong> Media
                </button>
              </div>
          </div>
            
          {/* Hamburger Menu */}
          <button className='profile-hamburger' onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </button>
          {menuOpen && (
            <div className={`profile-dropdown-menu ${menuOpen ? 'menu-open' : ''}`}>
              <Button
                buttonStyle='small-button'
                buttonText='Edit Profile'
                onClick={() => setEditProfile(true)}
              />
              <Button
                buttonStyle='small-button'
                buttonText='Logout'
                onClick={handleLogout}
              />
            </div>
          )}
        </div>

        {/* Bio */}
        <p className='bio'>{profile.bio}</p>
        </div>


        {/* Card Scrolls */}
        <div>
          <h2 className='section-title'>Your Reviews</h2>
          <CardScroll ids={profile.reviews} card_type='review' />
        </div>

        {/* Conditional Following and To-Do Rendering */}
        {viewFollowing && (<FollowingDisplay following={viewFollowing == 'user' ? followingUsers : followingMedia} type={viewFollowing} onClose={() => setViewFollowing('')} />)}
      </div>
  );
};

export default UserProfile;
