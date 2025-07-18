import { useState, useEffect } from 'react';
import './home.css';

import CardScroll from '../../components/cards/card-scroll/CardScroll';

export default function Home() {
    const [reviews, setReviews] = useState([]);
    const [media, setMedia] = useState([]);

    // Load data for card displays and recommended
    useEffect(() => {
        const loadHomePageData = async () => {
            const response = await fetch('http://localhost:3000/page/home');
            const result = await response.json();
            setReviews(result.reviews);
            setMedia(result.media);
        }
        loadHomePageData();
    }, []);

    // The body of the home page
    return (
        <main className='container-fluid p-4'>
            <div className='row'>
                <div className='col-lg-6 col-md-12 mb-4'>
                    <div className='p-4 bg-primary text-white rounded h-100'>
                        <h2 className='section-title'>Recommended</h2>
                        <CardScroll ids={media} card_type='media' />
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
    );
};