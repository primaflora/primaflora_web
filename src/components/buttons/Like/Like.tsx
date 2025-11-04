import React, { FC } from 'react';
import { Images } from '../../../assets';
import { TLikeProps } from './types';
import './style.css';

export const Like: FC<TLikeProps> = ({ isLiked, onLike, onDislike }) => {
    const handleLike = () => {
        if (isLiked) {
            onDislike();
        } else {
            onLike();
        }
    };

    return (
        <button className="like" onClick={handleLike}>
            {isLiked ? (
                <img src={Images.LikeRedIcon} alt="unlike" />
            ) : (
                <img src={Images.LikeIcon} alt="like" />
            )}
        </button>
    );
};
