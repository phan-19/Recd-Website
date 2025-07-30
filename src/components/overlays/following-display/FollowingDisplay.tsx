import React, { useState } from 'react';
import CardScroll from '../../cards/card-scroll/CardScroll';
import './FollowingDisplay.css';

type FollowingDisplayProps = {
    onClose: () => void;
    following: number[]
    type: string
};

const FollowingDisplay: React.FC<FollowingDisplayProps> = ({ onClose, following, type }) => {
    return (
        <div className='overlay'>
            <div className='following-content'>
                <div>
                    <h2 className="section-title">Following</h2>
                    <CardScroll ids={following} card_type={type} />
                </div>
                <button type="button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default FollowingDisplay;
