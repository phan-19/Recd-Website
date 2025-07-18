import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Home from './pages/home/home';
import Movies from './pages/movies/movies';
import Shows from './pages/shows/shows';
import Books from './pages/books/books';
import Misc from './pages/misc/misc';
import Profile from './pages/profile/profile';
import Search from './pages/search/search'

//Overlays
import ReviewDisplay from './components/overlays/review-display/ReviewDisplay';
import MediaOverlay from './components/overlays/media-display/MediaOverlay'
import ProfileOverlay from './components/overlays/profile-display/ProfileOverlay';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <main>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/books" element={<Books />} />
          <Route path="/misc" element={<Misc />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route
                path="/media/:media_id"
                element={
                    <MediaOverlay />
                }
            />
            <Route 
                path="/review/:review_id" 
                element={
                    <ReviewDisplay />
                } 
            />
            <Route 
                path="/user/:user_id" 
                element={
                    <ProfileOverlay />
                }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default AppRoutes;
