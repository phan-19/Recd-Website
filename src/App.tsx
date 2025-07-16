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
import MediaDisplay from './components/media-display/MediaDisplay'

type User = {
  user_id: number
}

type Item = {
  item_id: number,
  type: string,
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  //Verify that a user is logged in before rendering the page
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
    <>
    <div className='form'>
      <Signup />
      <p>
        Already have an account?{' '}
        <button onClick={() => setShowSignup(false)}>Log In</button>
      </p>
      </div>
    </>
  ) : (
    <>
    <div className='form'>
      <Login onLogin={handleLogin} />
      <p>
        Don't have an account?{' '}
        <button onClick={() => setShowSignup(true)}>Sign Up</button>
      </p>
      </div>
    </>
  );
  }
  //End login logic

  // Check if the user is viewing a specific item (media, review, profile)

  const [ item, setItem ] = useState<Item | null>(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('currItem');
    if (stored) {
      setItem(JSON.parse(stored));
    }
  }, []);

  //Page rendering logic
  const renderPage = () => {
    if (item && item.type === 'media') {
      return <MediaDisplay />;
    } else if (item && item.type === 'profile') {
      return <p>Other user profile will display here</p>;
    } else if (item && item.type === 'review') {
      return <p>Review will display here</p>
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
