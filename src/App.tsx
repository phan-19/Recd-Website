import './App.css';
import { useState, useEffect } from 'react';

import Navbar from './components/navbar/navbar';

import Home from './pages/home/home'
import Movies from './pages/movies/movies'
import Shows from './pages/shows/shows'
import Books from './pages/books/books'
import Misc from './pages/misc/misc'
import Profile from './pages/profile/profile'
import Login from './pages/login/login'
import Signup from './pages/signup/signup'
import MediaDisplay from './pages/media-display/MediaDisplay'
import ReviewDisplay from './pages/review-display/ReviewDisplay'
import ProfileDisplay from './pages/profile-display/ProfileDisplay'

type User = {
  user_id: number
}

type Item = {
  item_id: number,
  type: string,
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [item, setItem] = useState<Item | null>(null); 

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Load item from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('item');
    if (stored) {
      setItem(JSON.parse(stored));
    } else {
      setItem(null);
    }
  }, []);

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  if (!user) {
    return showSignup ? (
      <div className='form'>
        <Signup />
        <p>
          Already have an account?{' '}
          <button onClick={() => setShowSignup(false)}>Log In</button>
        </p>
      </div>
    ) : (
      <div className='form'>
        <Login onLogin={handleLogin} />
        <p>
          Don't have an account?{' '}
          <button onClick={() => setShowSignup(true)}>Sign Up</button>
        </p>
      </div>
    );
  }

  const renderPage = () => {
    if (item && item.type === 'media') {
      return <MediaDisplay />;
    } else if (item && item.type === 'user') {
      return <ProfileDisplay />;
    } else if (item && item.type === 'review') {
      return <ReviewDisplay />;
    }

    if (currentPage === 'home') {
      return <Home />;
    } else if (currentPage === 'movies') {
      return <Movies />;
    } else if (currentPage === 'shows') {
      return <Shows />;
    } else if (currentPage === 'books') {
      return <Books />;
    } else if (currentPage === 'misc') {
      return <Misc />;
    } else if (currentPage === 'profile') {
      return <Profile />;
    }
    return null;
  }

  return (
    <div className="App">
      <header>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage}></Navbar>
      </header>
      <div>
      {renderPage()}
    </div>
    </div>
  );
}

export default App;
