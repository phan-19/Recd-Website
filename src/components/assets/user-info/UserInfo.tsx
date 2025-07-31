import { useState } from "react";

import FollowingDisplay from "../../overlays/following-display/FollowingDisplay";

type UserInfoProps = {
    profile: {
        user_id: number,
        reviews: number[],
    }
    followingUsers: number[],
    followingMedia: number[],
}

const UserInfo: React.FC<UserInfoProps> = ({ profile, followingUsers, followingMedia }) => {
    const [viewFollowing, setViewFollowing] =  useState('');

    return (
        <div>
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

        {/* Conditional Following and To-Do Rendering */}
        {viewFollowing === 'user' && followingUsers.length > 0 && (
            <FollowingDisplay following={followingUsers} type={'user'} onClose={() => setViewFollowing('')} />
        )}
        {viewFollowing === 'media' && followingMedia.length > 0 && (
            <FollowingDisplay following={followingMedia} type={'media'} onClose={() => setViewFollowing('')} />
        )}
        </div>
    )
}

export default UserInfo;