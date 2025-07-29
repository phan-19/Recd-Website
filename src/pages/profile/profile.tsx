import React, { useState, useEffect } from 'react';
import './profile.css';

import Button from '../../components/assets/button/Button';
import CardScroll from '../../components/cards/card-scroll/CardScroll';

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
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [following, setFollowing] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const storedUser: User = JSON.parse(stored);
      setUser(storedUser);

      fetch(`http://localhost:3000/page/user/${storedUser.user_id}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error('Failed to fetch profile:', err));

      fetch(`http://localhost:3000/list/${storedUser.user_id}/watchlist`)
        .then(res => res.json())
        .then((data: MediaRes) => setWatchlist(data.result))
        .catch(err => console.error('Failed to fetch watchlist:', err));

      fetch(`http://localhost:3000/list/${storedUser.user_id}/following`)
        .then(res => res.json())
        .then((data: MediaRes) => setFollowing(data.result))
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
    <div className="profile user">
      <div className="profile-content">
        <div className="profile-header">
          {profile.profile_pic.length > 0 && (
            <img
              src={getProfilePicSrc(profile.profile_pic)}
              alt={`${profile.username}'s profile`}
              className="profile-pic"
            />
          )}
          <h2 className="username">@{profile.username}</h2>
          <button className="profile-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className={`profile-dropdown-menu ${menuOpen ? 'menu-open' : ''}`}>
              <Button
                buttonStyle="small-button"
                buttonText="Edit Profile"
                onClick={() => setEditProfile(true)}
              />
              <Button
                buttonStyle="small-button"
                buttonText="Logout"
                onClick={handleLogout}
              />
            </div>
          )}
        </div>
        <p className="bio">{profile.bio}</p>
      </div>

      <div>
        <h2 className="section-title">Your Reviews</h2>
        <CardScroll ids={profile.reviews} card_type="review" />
      </div>

      <div>
        <h2 className="section-title">Your Watchlist</h2>
        <CardScroll ids={watchlist} card_type="media" />
      </div>

      <div>
        <h2 className="section-title">Following</h2>
        <CardScroll ids={following} card_type="user" />
      </div>
    </div>
  );
};

export default UserProfile;
