import React, { useState } from 'react';
import './login.css';

type LoginProps = {
    onLogin: (user: { user_id: number, username: string }) => void;
}

const UserLogin: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
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
                console.log('User logged in:', {username, password});
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
        <>
            <div className='row'>
                <h1 className='title'>RECD</h1>
            <div>
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
            </div>
            </div>
        </>
    );
};

export default function Login({onLogin}: LoginProps) {
    return (
        <main>
            <UserLogin onLogin={onLogin}/>
        </main>
        
    );
}