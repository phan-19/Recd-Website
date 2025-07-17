import React from 'react';
import ReviewCard from '../ReviewCard';
import MediaCard from '../MediaCard';
import UserCard from '../UserCard';
import './CardScoll.css';

type CardScrollProps = {
    ids: number[]
    card_type: string
}

const CardScroll: React.FC<CardScrollProps> = ({ ids, card_type }) => {
    const LoadCards = (ids: number[], card_type: string) => {
        if (!ids) {
            return null;
        }
        switch (card_type) {
            case "review":
                return ids.map((id, index) => (<ReviewCard key={index} cardStyle='card' id={id} />));
            case "media":
                return ids.map((id, index) => (<MediaCard key={index} cardStyle='card' id={id} />));
            case "user":
                return ids.map((id, index) => (<UserCard key={index} cardStyle='card' id={id} />));
        }
    }

    return (
        <div className='card-scroll'>
            {LoadCards(ids, card_type)}
        </div>);
}

export default CardScroll;