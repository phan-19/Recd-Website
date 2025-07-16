import './home.css';

import CardScroll from "../../components/assets/cards/card-scroll/CardScroll";
import { useState, useEffect } from 'react';

export default function Home() {
    const [reviews, setReviews] = useState([]);
    const [media, setMedia] = useState([]);

    useEffect(() => {
        const loadHomePageData = async () => {
            const response = await fetch("http://66.231.155.18:3000/page/home");
            const result = await response.json();
            setReviews(result.reviews);
            setMedia(result.media);
        }
        loadHomePageData();
    }, []);

    return (
        <main>
            <div>
                <h2 className='section-title'>
                    Recommended
                </h2>
                <CardScroll ids={media} card_type='media' />
                <h2 className='section-title'>
                    Recent Activity
                </h2>
                <CardScroll ids={reviews} card_type='review' />
            </div>
        </main>

    );
}