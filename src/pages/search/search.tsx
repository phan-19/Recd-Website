import { useEffect, useState } from 'react';
import SearchBar from '../../components/assets/search-bar/SearchBar';
import MediaCard from '../../components/cards/MediaCard';
import UserCard from '../../components/cards/UserCard';
import './Search.css';

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
  const [ loading, setLoading ] = useState(false);
  const [ err, setErr ] = useState('');

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
    setLoading(true);

    const timer = setTimeout(() => {
      Promise.all([searchMedia(query), searchUsers(query)])
        .then(([m, u]) => {
          setMedia(m.media_ids.map((id, i) => ({ id, name: m.names[i] })));
          setUsers(u.user_ids.map((id, i) => ({ id, username: u.usernames[i] })));
          setErr('');
        })
        .catch(() => setErr('Server error — please try again.'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="p-4 space-y-6">
      <h2 className="section-title text-xl font-bold">Search</h2>

      <SearchBar
        onSearch={setQuery}
        onEnter={setQuery}
      />

      {loading && <p className="italic text-sm">Searching…</p>}
      {err &&     <p className="text-red-600">{err}</p>}

      {/* ---------- Media row ---------- */}
      {!!media.length && (
        <>
          <h3 className="font-semibold">Media</h3>
          <div className="card-row">
            {media.map(m => (
              <MediaCard
                key={m.id}
                cardStyle="card"
                id={m.id}
              />
            ))}
          </div>
        </>
      )}

      {/* ---------- User row ---------- */}
      {!!users.length && (
        <>
          <h3 className="font-semibold">Users</h3>
          <div className="card-row user-row">
            {users.map(u => (
              <UserCard
                key={u.id}
                cardStyle="card"
                id={u.id}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}