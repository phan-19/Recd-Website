import './App.css';
import { useState } from 'react';

import Navbar from './components/navbar/navbar';

import Home from './pages/home/home'
import Profile from './pages/profile/profile'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    if (currentPage === 'home') {
      return <Home />;
    } else if (currentPage === 'profile') {
      return <Profile />;
    }
    return null;
  }

  return (
    <div className="App">
      <header>
        <Navbar setCurrentPage={setCurrentPage}></Navbar>
      </header>
      <div>
      {renderPage()}
    </div>
    </div>
  );
}

export default App;
