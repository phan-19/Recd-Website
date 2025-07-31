import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import Button from '../assets/button/Button';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 672);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth <= 672);
      if (window.innerWidth > 672) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathToPage = (path: string) => {
    if (path.startsWith('/movies')) return 'movies';
    if (path.startsWith('/shows')) return 'shows';
    if (path.startsWith('/books')) return 'books';
    if (path.startsWith('/misc')) return 'misc';
    if (path.startsWith('/profile')) return 'profile';
    if (path === '/' || path === '') return 'home';
    return '';
  };

  const currentPage = pathToPage(location.pathname);
  const isActive = (page: string) => (currentPage === page ? 'active' : '');

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <Button
          buttonStyle={`nav-button ${isActive('search')}`}
          buttonText='SEARCH'
          onClick={() => navigate('/search')}
        />
      </div>

      <div className='navbar-center'></div>

      <div className='navbar-right'>
        {!smallScreen && (
          <ul className='nav-buttons'>
            {['home', 'movies', 'shows', 'books', 'misc', 'profile'].map((page) => (
              <li key={page}>
                <Button
                  buttonStyle={`nav-button ${isActive(page)}`}
                  buttonText={page.toUpperCase()}
                  onClick={() => {navigate(page === 'home' ? '/' : `/${page}`), setMenuOpen(false)}}
                />
              </li>
            ))}
          </ul>
        )}

        {smallScreen && (
          <>
            <button className='hamburger' onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>

            <div className={`dropdown-menu ${menuOpen ? 'menu-open' : ''}`}>
              {['home', 'movies', 'shows', 'books', 'misc', 'profile'].map((page) => (
                <div key={page} className='dropdown-item'>
                  <Button
                    buttonStyle={`nav-button ${isActive(page)}`}
                    buttonText={page.toUpperCase()}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(page === 'home' ? '/' : `/${page}`);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
