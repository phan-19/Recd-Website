import React from 'react';
import ReviewCard from '../review-card/ReviewCard';
import MediaCard from '../media-card/MediaCard';
import './CardScoll.css';

type CardScrollProps = {
    ids: number[]
    card_type: string
}

const CardScroll: React.FC<CardScrollProps> = ({ ids, card_type }) => {
    const LoadCards = (ids: number[], card_type: string) => {
        switch (card_type) {
            case "review":
                return ids.map((id, index) => (<ReviewCard key={index} cardStyle='card' id={id} />));
            case "media":
                return ids.map((id, index) => (<MediaCard key={index} cardStyle='card' id={id} />));
            case "user":
                break;
        }
    }

    return (
        <div className='card-scroll'>
            {LoadCards(ids, card_type)}
        </div>);
}

export default CardScroll;