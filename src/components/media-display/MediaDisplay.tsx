import React, { useState, useEffect } from 'react';
import './MediaDisplay.css'

type Media = {
    media_id: number,
    media_name: string,
    description: string,
    medium: string,
    reviews: [],
}

const UserProfile: React.FC = () => {
    const [media, setMedia] = useState<Media | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('currItem');
        if (stored) {
            const storedMedia: Media = JSON.parse(stored);
            setMedia(storedMedia);

            fetch(`http://localhost:3000/page/media/${storedMedia.media_id}`)
                .then(response => response.json())
                .then(data => {
                    setMedia(data);
                })
                .catch(err => {
                    console.error('Failed to fetch item:', err);
                });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (!media) {
        return <p>This title could not be found.</p>;
    }

    return (
        <div className="media-page">
            <div className='media-content'>
                <h2 className='title'>{media.media_name}</h2>
                <h4 className='medium'>{media.medium}</h4>
                <p className='description'>{media.description}</p>
                <button>Post a Review</button>
                {/* Review scroll here - Feeling lazy rn */}
            </div>
        </div>
    );
}

export default UserProfile;
