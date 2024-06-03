import { Images } from '../../../assets';
import { TLikeProps } from './types';
import './style.css';

export const Like = ({ isLiked, onLike, onDislike }: TLikeProps) => {
    const handleLike = () => {
        if (isLiked) {
            isLiked = false;
            onDislike();
        } else {
            isLiked = true;
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
