import React, { useEffect, useState } from 'react';
import '../button/Button.css';

type FollowButtonProps = {
    style: string;
    type: string;
    followed_id: number;
};

const FollowButton: React.FC<FollowButtonProps> = ({ style, type, followed_id }) => {
    const [following, setFollowing] = useState(false);
    const [follower_id, setFollowerId] = useState<number | null>(null);

    async function update(follower_id: number) {
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
        if (follower_id) {
            update(follower_id);
        }
    }

    async function unfollow() {
        const url: string = `http://localhost:3000/follow/${type}/${follower_id}/${followed_id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        if (follower_id) {
            update(follower_id);
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const storedUserId = JSON.parse(stored).user_id
            setFollowerId(storedUserId);
            update(storedUserId);
        }
    }, [followed_id, followed_id])

    function loadFollowButton() {
        return (follower_id != followed_id || type == 'media' ? following ? <button className={style} onClick={() => unfollow()}>unfollow</button> : <button className={style} onClick={() => follow()}>follow</button> : null)
    }

    return (loadFollowButton())
};

export default FollowButton;