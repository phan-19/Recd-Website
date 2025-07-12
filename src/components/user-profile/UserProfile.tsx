import React, { useState, useEffect } from 'react';
import './UserProfile.css'

import UserLogin from '../user-login/UserLogin';

type User = {
    user_id: number,
    username: string,
    bio: string
};

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const handleLogin = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    if (!user) {
        return <UserLogin onLogin={handleLogin}/>
    }

    return (
        <div className="profile">
            <div className='profile-content'>
                <h2 className='username'>{'@'}{user.username}</h2>
                <p className='bio'>{user.bio}</p>
                <button onClick={handleLogout}>Log Out</button>
            </div>
            {/* Maybe add a "Favorites" feature where the user has like 3 top things in their profile heading */}
        </div>
    )
}

export default UserProfile;