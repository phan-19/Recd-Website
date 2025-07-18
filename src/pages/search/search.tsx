import { useEffect, useState } from 'react';
import SearchBar from '../../components/assets/search-bar/SearchBar';
import MediaForm from '../../components/forms/media-form/MediaForm'
import MediaCard from '../../components/cards/MediaCard';
import UserCard from '../../components/cards/UserCard';
import './Search.css';
import CardScroll from '../../components/cards/card-scroll/CardScroll';

type UserRes  = { 
  user_ids: number[]; 
  usernames: string[] 
};

type MediaRes = { 
  media_ids: number[]; 
  names: string[]
};

type SearchProps = { 
  initialQuery?: string 
};

export default function Search({ initialQuery = '' }: SearchProps) {
  const [ query,  setQuery ] = useState(initialQuery);
  const [ media,  setMedia ] = useState<{ id: number; name: string }[]>([]);
  const [ users,  setUsers ] = useState<{ id: number; username: string }[]>([]);
  const [ err, setErr ] = useState('');

  const [ postMedia, setPostMedia ] = useState(false);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setMedia([]);
      setUsers([]);
      return;
    }

    async function searchMedia(term: string): Promise<MediaRes> {
      const response = await fetch(`http://localhost:3000/search/media/${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Media fetch failed');
      return await response.json();
    }

    async function searchUsers(term: string): Promise<UserRes> {
      const response = await fetch(`http://localhost:3000/search/user/${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('User fetch failed');
      return await response.json();
    }

    const timer = setTimeout(() => {
      Promise.all([searchMedia(query), searchUsers(query)])
        .then(([m, u]) => {
          setMedia(m.media_ids.map((id, i) => ({ id, name: m.names[i] })));
          setUsers(u.user_ids.map((id, i) => ({ id, username: u.usernames[i] })));
          setErr('');
        })
        .catch(() => setErr('Server error — please try again.'))
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className='container-fluid p-4'>

      {/* Search bar */}
      <div className='row justify-content-center'>
        <div className='col-lg-8 col-md-8 col-sm-12 mb-4'>
          <div className='p-4 bg-primary h-100 search-bar-container'>
            <SearchBar
            onSearch={setQuery}
            onEnter={setQuery}
            />
            {err && <p className='text-red-600'>{err}</p>}
          </div>
        </div>
      </div>

      {/* Post Media Button */}
      <div className='text-center mb-4'>
        <button className='btn btn-success' type='button' onClick={() => setPostMedia(!postMedia)}>Add an Item</button>
      </div>

      {/* Media Row */}
      {!!media.length && (
        <section className='mb-5'>
          <h3 className='mb-3 section-title'>Media Containing "{query}"</h3>
          <div>
            <CardScroll 
              ids={media.map(m => m.id)} card_type='media'
            />
          </div>
        </section>
      )}

      {/* User Row */}
      {!!users.length && (
        <section className='mb-5'>
          <h3 className='mb-3 section-title'>Users Containing "{query}"</h3>
          <div>
            <CardScroll 
              ids={media.map(m => m.id)} card_type='user'
            />
          </div>
        </section>
      )}

      {postMedia && (
        <div>
            {postMedia && (
                <div className='overlay'>
                    <div className='overlay-component'>
                        <MediaForm onClose={() => setPostMedia(!postMedia)} />
                    </div>
                </div>
            )}
          </div>
      )}
    </main>
  );
}