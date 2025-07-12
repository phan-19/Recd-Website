import React, { useState } from 'react';
import './UserLogin.css';

type UserLoginProps = {
    onLogin: (username: string, password: string) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({onLogin}) => {
    const [username, setUsername] = useState(''); //p
    const [password, setPassword] = useState(''); //vrysecurepassword:D
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = `http://66.231.155.18:3000/login/${username}/${password}`;

        try {
            const response = await fetch(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setUserId(result.user_id);
                setMessage(`Login successful`);
            } else {
                setMessage("Invalid username or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Could not connect to server. Please try again.");
        }
    };

    return (
        <form className="user-login" onSubmit={handleSubmit}>
            <h2 className="login-title">Log In</h2>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Log In</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UserLogin;
