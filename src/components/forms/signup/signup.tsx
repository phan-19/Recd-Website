import React, { useState } from 'react';
import './signup.css';

const UserSignup: React.FC = () => {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ bio, setBio ] = useState('');
    const [ profilePic, setProfilePic ] = useState<Array<number> | null>(null);
    const [ message, setMessage ] = useState('');

    const convertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                setProfilePic(Array.from(byteArray));
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = 'http://localhost:3000/user';

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    bio,
                    profile_pic: profilePic ?? [],
                }),
            };

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.result) {
                setMessage('Signup was successful. Please log in.');
            } else {
                setMessage('Signup failed: ' + result.err);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Could not connect to server. Please try again.');
        }
    };

    return (
        <form className='user-signup' onSubmit={handleSubmit}>
            <h2 className='signup-title'>Sign Up</h2>
            <input
                type='text'
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type='text'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <textarea
                className='bio'
                maxLength={250}
                placeholder='bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <label htmlFor='image'>Profile Photo:</label>
            <input
                type='file'
                id='image'
                accept='image/*'
                onChange={convertImage}
            />
            <button type='submit'>Sign Up</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default function Signup() {
    return (
        <main>
            <UserSignup />
        </main>
    );
}
