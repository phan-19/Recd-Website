import { useEffect, useState } from 'react';
import './Search.css';

import SearchBar from '../../components/assets/search-bar/SearchBar';
import MediaForm from '../../components/forms/media-form/MediaForm';
import CardScroll from '../../components/cards/card-scroll/CardScroll';
import Button from '../../components/assets/button/Button';

type UserRes  = { 
  result: number[]; 
};

type MediaRes = { 
  result: number[];
};

type SearchProps = { 
  initialQuery?: string 
};

export default function Search({ initialQuery = '' }: SearchProps) {
  const [ query,  setQuery ] = useState(initialQuery);
  const [ media,  setMedia ] = useState<number[]>([]);
  const [ users,  setUsers ] = useState<number[]>([]);
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ postMedia, setPostMedia ] = useState(false);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setMedia([]);
      setUsers([]);
      setErr('');
      return;
    }

    setLoading(true);
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
          setMedia(m.result);
          setUsers(u.result);
          setErr('');
        })
        .catch(() => setErr('Server error — please try again.'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className='container-fluid p-4'>
      {/* Search bar */}
      <div className='row justify-content-center'>
        <div className='col-lg-8 col-md-8 col-sm-12 mb-4'>
          <div className='p-4 h-100 search-bar-container'>
            <SearchBar
            onSearch={setQuery}
            onEnter={setQuery}
            />
            {err && <p className='text-red-600'>{err}</p>}
          </div>
        </div>
      </div>

      {/* Post Media Button */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8 col-md-8 col-sm-12 text-end">
          <Button
            buttonStyle='add-item'
            buttonText='Add an Item'
            onClick={() => setPostMedia(true)}
          />
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {/* Media Row */}
      {!!media.length && (
        <section className='mb-5'>
          <h3 className='mb-3 section-title'>Media Containing "{query}"</h3>
          <div>
            <CardScroll 
              ids={media} card_type='media'
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
              ids={users} card_type='user'
            />
          </div>
        </section>
      )}

      {postMedia && (
        <div>
            <div className='overlay'>
                <div className='overlay-component'>
                    <MediaForm onClose={() => setPostMedia(false)} />
                </div>
            </div>
        </div>
      )}
    </main>
  );
}