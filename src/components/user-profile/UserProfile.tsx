import React from 'react';
import './UserProfile.css'

type ProfileProps = {
    profileStyle: string;
    displayName: string;
    username: string;
    bio: string;
}

const UserProfile: React.FC<ProfileProps> = ({ profileStyle, displayName, username, bio}) => {
    return (
        <div className={profileStyle}>
            <div className='profile-content'>
                <h2 className='display-name'>{displayName}</h2>
                <h4 className='username'>{'@'}{username}</h4>
                <p className='bio'>{bio}</p>
            </div>
            {/* Maybe add a "Favorites" feature where the user has like 3 top things in their profile heading */}
        </div>
    );
};

export default UserProfile;