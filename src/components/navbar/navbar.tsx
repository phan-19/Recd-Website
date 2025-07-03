import './Navbar.css';

import Button from '../assets/button/Button';

interface NavbarProps {
    setCurrentPage: (page: string) => void;
    currentPage: string;
}

export default function Navbar({ setCurrentPage, currentPage }: NavbarProps) {
    const isActive = (page: string) => currentPage === page ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">Recd</a>
            </div>
            <div className="navbar-center">
                
            </div>
            <div className="navbar-right">
                <ul className="nav-buttons">
                    <Button 
                    buttonStyle={`nav-button ${isActive('home')}`}
                    buttonText={'HOME'} 
                    onClick={() => setCurrentPage('home')}
                    />
                    <Button 
                    buttonStyle={`nav-button ${isActive('movies')}`}
                    buttonText={'MOVIES'}
                    onClick={() => setCurrentPage('movies')}
                    />
                    <Button 
                    buttonStyle={`nav-button ${isActive('shows')}`}
                    buttonText={'SHOWS'}
                    onClick={() => setCurrentPage('shows')}
                    />
                    <Button 
                    buttonStyle={`nav-button ${isActive('books')}`}
                    buttonText={'BOOKS'}
                    onClick={() => setCurrentPage('books')}
                    />
                    <Button
                    buttonStyle={`nav-button ${isActive('misc')}`}
                    buttonText={'MISC'}
                    onClick={() => setCurrentPage('misc')}
                    />
                    <Button 
                    buttonStyle={`nav-button ${isActive('profile')}`}
                    buttonText={'PROFILE'} 
                    onClick={() => setCurrentPage('profile')}
                    />
                </ul>
            </div>
        </nav>
    )
}