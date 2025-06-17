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
                    ></Button>

                    <Button 
                    buttonStyle={`nav-button ${isActive('profile')}`}
                    buttonText={'PROFILE'} 
                    onClick={() => setCurrentPage('profile')}
                    ></Button>
                </ul>
            </div>
        </nav>
    )
}