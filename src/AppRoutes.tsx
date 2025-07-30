import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Home from './pages/home/home';
import Movies from './pages/movies/movies';
import Shows from './pages/shows/shows';
import Books from './pages/books/books';
import Misc from './pages/misc/misc';
import Profile from './pages/profile/profile';
import Search from './pages/search/search';
import Media from './pages/item/media/media';
import User from './pages/item/user/user';

//Overlays
import MediaOverlay from './components/overlays/media-display/MediaOverlay'
import ProfileOverlay from './components/overlays/profile-display/ProfileOverlay';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <div className='App'>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes location={state?.backgroundLocation || location}>
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/shows' element={<Shows />} />
          <Route path='/books' element={<Books />} />
          <Route path='/misc' element={<Misc />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<Search />}/>
          <Route path='/media/:media_id' element={<Media />}/>
          <Route path='/user/:user_id' element={<User />}/>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route
                path='/media/:media_id/preview'
                element={
                  <MediaOverlay />
                }
            />
            <Route 
                path='/user/:user_id/preview' 
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
