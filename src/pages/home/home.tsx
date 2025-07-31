import { useState, useEffect } from 'react';
import './home.css';

import CardScroll from '../../components/cards/card-scroll/CardScroll';

export default function Home() {
    const [ user_id, setUserId ] = useState<number | null>(null);
    const [ recommended, setRecommended ] = useState<number[]>([]);
    const [ recent_media, setRecentMedia ] = useState<number[]>([]);
    const [ reviews, setReviews ] = useState<number[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const storedUser = JSON.parse(stored);
                setUserId(storedUser.user_id);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (user_id === null) return;

        const loadHomePageData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/page/home/${user_id}`);
                const result = await response.json();
                setRecommended(result.recommended);
                setRecentMedia(result.recent);
                setReviews(result.reviews);
            } catch (err) {
                console.error('Failed to fetch homepage data:', err);
            }
            setLoading(false);
        };

        loadHomePageData();
    }, [user_id]);

    // The body of the home page
    if (!loading) return (
        <main className='container-fluid p-4'>
            <div className='row'>
                <div className='col-lg-6 col-md-12 mb-4'>
                    <div className='p-4 bg-primary text-white rounded h-100'>
                        <h2 className='section-title'>Recommended</h2>
                        <CardScroll ids={recommended} card_type='media' />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-6 col-md-12 mb-4'>
                    <div className='p-4 bg-primary text-white rounded h-100'>
                        <h2 className='section-title'>Recent Media</h2>
                        <CardScroll ids={recent_media} card_type='media' />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-6 col-md-12 mb-4'>
                    <div className='p-4 bg-primary text-white rounded h-100'>
                        <h2 className='section-title'>Recent Reviews</h2>
                        <CardScroll ids={reviews} card_type='review' />
                    </div>
                </div>
            </div>
        </main>
    ); else return (
        <div className="spinner" role="status" aria-label="Loading"></div>
    );
};