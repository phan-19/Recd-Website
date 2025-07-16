import React, { useState } from 'react';
import './UserLogin.css';

type UserLoginProps = {
    onLogin: (user: { user_id: number, username: string }) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState(''); //p
    const [password, setPassword] = useState(''); //vrysecurepassword:D
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = `http://localhost:3000/login/${username}/${password}`;

        try {
            const response = await fetch(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const user = {
                    user_id: result.user_id,
                    username: result.username
                };
                setMessage(`Login successful`);
                localStorage.setItem("user", JSON.stringify(user))
                console.log('User logged in:', { username, password });
                onLogin(user);
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
