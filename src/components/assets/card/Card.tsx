import React from 'react';
import './Card.css'

type CardProps = {
    cardStyle: string;
    image: string;
    title: string;
    type: string;
    rating: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ cardStyle, title, type, rating, description, image }) => {
    return (
        <div className={cardStyle}>
            <img src={image} alt={title} className='card-image'></img>
            <div className='card-content'>
                <h2 className='card-title'>{title}</h2>
                <h4 className='card-type'>{type}</h4>
                <p className='card-rating'>{rating}</p>
                <p className='card-description'>{description}</p>
            </div>
        </div>
    );
};

export default Card;