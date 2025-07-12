import React, { useState } from 'react';
import './UserLogin.css'

type LoginProps = {
    onLogin: (username: string, password: string) => void;
}

const UserLogin: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ message, setMessage] = useState('');
    const [userID, setUserID] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginURL = `http://66.231.155.18:3000/user/login/${username}/${password}`;

        try {
            const response = await fetch(loginURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            
        });

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            setUserID(result.user_id);
            setMessage('Login Successful');
        } else {
            setMessage('Login Failed');
        }

        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occured. Please try again.');
        }
    };

    return (
        <form className = 'user-login' onSubmit={handleSubmit}>
            <h2 className='section-title'>Login</h2>
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
            <button type='submit'>Log In</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UserLogin;