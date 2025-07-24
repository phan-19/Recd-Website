import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import Login from './components/forms/login/login';
import Signup from './components/forms/signup/signup';

type User = {
  user_id: number;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);

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
          <p className='prompt'>
            Already have an account?{' '}
            <button onClick={() => setShowSignup(false)}>Log In</button>
          </p>
        </div>
      </div>
    ) : (
      <div className="auth-page">
        <div className="form-container">
          <Login onLogin={handleLogin} />
          <p className='prompt'>
            Don't have an account?{' '}
            <button onClick={() => setShowSignup(true)}>Sign Up</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;