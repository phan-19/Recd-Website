import './App.css';
import { useState } from 'react';

import Navbar from './components/navbar/navbar';

import Home from './pages/home/home'
import Movies from './pages/movies/movies'
import Shows from './pages/shows/shows'
import Books from './pages/books/books'
import Misc from './pages/misc/misc'
import Profile from './pages/profile/profile'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
