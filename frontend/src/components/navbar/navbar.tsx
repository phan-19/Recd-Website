import './Navbar.css';

import Button from '../assets/Button';

interface NavbarProps {
    setCurrentPage: (page: string) => void;
}

export default function Navbar({ setCurrentPage }: NavbarProps) {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">Page Title</a>
            </div>
            <div className="navbar-center">
                
            </div>
            <div className="navbar-right">
                <ul className="nav-buttons">
                    <Button buttonText={'HOME'} onClick={() => setCurrentPage('home')}></Button>
                    <Button buttonText={'PROFILE'} onClick={() => setCurrentPage('profile')}></Button>
                </ul>
            </div>
        </nav>
    )
}