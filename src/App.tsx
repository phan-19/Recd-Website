import './App.css';
import { useState, useEffect } from 'react';

import Navbar from './components/navbar/navbar';
import UserLogin from './components/user-login/UserLogin'

import Home from './pages/home/home'
import Movies from './pages/movies/movies'
import Shows from './pages/shows/shows'
import Books from './pages/books/books'
import Misc from './pages/misc/misc'
import Profile from './pages/profile/profile'
import Login from './pages/login/login'
import Signup from './pages/signup/signup'

type User = {
  user_id: number
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  //Verify that a user is logged in before rendering the page
  const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    if (!user) {
        return <Login onLogin={(user: User) => (setUser(user))}/>
    }

  const renderPage = () => {
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
