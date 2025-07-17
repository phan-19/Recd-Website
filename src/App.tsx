import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import Login from './pages/login/login';
import Signup from './pages/signup/signup';

type User = {
  user_id: number;
  username: string;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  if (!user) {
    return showSignup ? (
      <div className="auth-page">
        <div className="form-container">
          <Signup />
          <p>
            Already have an account?{' '}
            <button onClick={() => setShowSignup(false)}>Log In</button>
          </p>
        </div>
      </div>
    ) : (
      <div className="auth-page">
        <div className="form-container">
          <Login onLogin={handleLogin} />
          <p>
            Don't have an account?{' '}
            <button onClick={() => setShowSignup(true)}>Sign Up</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes
        searchTerm={searchTerm}
        onSubmitSearch={(q) => setSearchTerm(q)}
      />
    </Router>
  );
}

export default App;