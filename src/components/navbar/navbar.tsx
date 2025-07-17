import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '../assets/button/Button';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="navbar">
      <div>
        <Button
            buttonStyle={`nav-button ${isActive('search')}`}
            buttonText='SEARCH'
            onClick={() => navigate('/search')}
        />
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-right">
        <ul className="nav-buttons">
          <Button
            buttonStyle={`nav-button ${isActive('home')}`}
            buttonText="HOME"
            onClick={() => navigate('/')}
          />
          <Button
            buttonStyle={`nav-button ${isActive('movies')}`}
            buttonText="MOVIES"
            onClick={() => navigate('/movies')}
          />
          <Button
            buttonStyle={`nav-button ${isActive('shows')}`}
            buttonText="SHOWS"
            onClick={() => navigate('/shows')}
          />
          <Button
            buttonStyle={`nav-button ${isActive('books')}`}
            buttonText="BOOKS"
            onClick={() => navigate('/books')}
          />
          <Button
            buttonStyle={`nav-button ${isActive('misc')}`}
            buttonText="MISC"
            onClick={() => navigate('/misc')}
          />
          <Button
            buttonStyle={`nav-button ${isActive('profile')}`}
            buttonText="PROFILE"
            onClick={() => navigate('/profile')}
          />
        </ul>
      </div>
    </nav>
  );
}
