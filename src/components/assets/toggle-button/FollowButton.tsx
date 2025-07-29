import React, { useEffect, useState } from 'react';
import './FollowButton.css';

type FollowButtonProps = {
    style: string;
    type: string;
    follower_id: number;
    followed_id: number;
};

const FollowButton: React.FC<FollowButtonProps> = ({ style, type, follower_id, followed_id }) => {
    const [following, setFollowing] = useState(false);

    async function update() {
        const url: string = `http://localhost:3000/follow/${type}/${follower_id}/${followed_id}`;
        const response = await fetch(url);
        const result = await response.json();

        setFollowing(result.follows);
    }

    async function follow() {
        const url: string = `http://localhost:3000/follow/${type}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ follower_id, followed_id })
        };
        const response = await fetch(url, options);
        update();
    }

    async function unfollow() {
        const url: string = `http://localhost:3000/follow/${type}/${follower_id}/${followed_id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        update();
    }

    useEffect(() => { update() }, [followed_id, followed_id])

    function loadFollowButton() {
        return (following ? <button className={style} onClick={() => unfollow()}>unfollow</button> : <button className={style} onClick={() => follow()}>follow</button>)
    }

    return (loadFollowButton())
};

export default FollowButton;