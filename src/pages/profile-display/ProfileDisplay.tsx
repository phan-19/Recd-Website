import React, { useState, useEffect } from 'react';

type Profile = {
    user_id: number,
    username: string,
    bio: string,
    reviews: number[],
};

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('item');
        if (stored) {
            const storedProfile: Profile = JSON.parse(stored);
            setProfile(storedProfile); 

            fetch(`http://localhost:3000/page/user/${storedProfile.user_id}`)
                .then(response => response.json())
                .then(data => {
                    setProfile(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch item:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const handleExit = () => {
        localStorage.removeItem('item');
        setProfile(null);
        window.location.reload();
    };

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (!profile) {
        return <p>This profile could not be found.</p>;
    }

    return (
        <div className="profile">
            <div className='profile-content'>
                <h2 className='username'>{'@'}{profile.username}</h2>
                <p className='bio'>{profile.bio}</p>
                <button onClick={handleExit}>Go Back</button>
            </div>
        </div>
    );
}

export default UserProfile;
