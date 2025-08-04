import React, { useState } from 'react';
import './EditProfile.css';

type Profile = {
    user_id: number,
    username: string;
    bio: string;
    profile_pic: Array<number>;
}

type EditProfileProps = {
    onClose: () => void;
    profile: Profile;
}

const EditProfile: React.FC<EditProfileProps> = ({ onClose, profile }) => {
    const [new_username, setNewUsername] = useState(profile.username);
    const [new_password, setNewPassword] = useState('');
    const [new_bio, setNewBio] = useState(profile.bio);
    const [new_pic, setNewPic] = useState<Array<number> | null>(null);
    const [message, setMessage] = useState('');

    const convertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                setNewPic(Array.from(byteArray));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const updateInfo = async (field: string, value: string) => {
        const url = `http://localhost:3000/user/${profile.user_id}/${field}`;

        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_value: value }),
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Edit profile error:', error);
            setMessage('Could not connect to server. Please try again.');
        }
    };

    const updateImage = async () => {
        const url = `http://localhost:3000/image/user/${profile.user_id}`;

        try {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: new_pic })
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Edit profile error:', error);
            setMessage('Could not connect to server. Please try again.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (profile.username !== new_username) {
            updateInfo('username', new_username);
        }
        if (new_password !== '') {
            updateInfo('password', new_password);
        }
        if (profile.bio !== new_bio) {
            updateInfo('bio', new_bio);
        }
        if (new_pic && profile.profile_pic !== new_pic) {
            updateImage();
        }

        onClose();
    };

    return (
        <form className='user-edit' onSubmit={handleSubmit}>
            <h2 className='edit-title'>Edit Profile</h2>
            <input
                type='text'
                value={new_username}
                onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
                type='password'
                placeholder='New password (optional)'
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <textarea
                className='bio'
                maxLength={250}
                value={new_bio}
                onChange={(e) => setNewBio(e.target.value)}
            />
            <label htmlFor='image'>Profile Photo:</label>
            <input
                type='file'
                id='image'
                accept='image/*'
                onChange={convertImage}
            />
            <button type='submit'>Submit Changes</button>
            {message && <p className="error-message">{message}</p>}
        </form>
    );
};

export default EditProfile;