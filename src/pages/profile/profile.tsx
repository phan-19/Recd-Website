import React, { useState, useEffect } from 'react';
import './profile.css'

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
    const [ user, setUser ] = useState<User | null>(null);
    const [ profile, setProfile ] = useState<Profile | null>(null);
    
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
                {profile.profile_pic.length > 0 && (
                    <img
                        src={getProfilePicSrc(profile.profile_pic)}
                        alt={`${profile.username}'s profile`}
                        className="profile-pic"
                    />
                )}
                <h2 className='username '>{'@'}{profile.username}</h2>
                <p className='bio '>{profile.bio}</p>
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default UserProfile;