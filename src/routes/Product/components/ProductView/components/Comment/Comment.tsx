import { Row } from '../../../../../../components/common';
import './styles.css';
import { TCommentProps } from './types';

const avatarUrl =
    'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png';

export const Comment = ({ comment }: TCommentProps) => {
    return (
        <div className="comment">
            <Row>
                <Row style={{ justifyContent: 'start' }}>
                    <img
                        className={'comment-avatar'}
                        src={avatarUrl}
                        alt="avatar"
                    />
                    <h1 className="comment-username">{comment.user.name}</h1>
                    <p className="comment-text">{comment.text}</p>
                </Row>
                <p className="text-black font-light ">
                    {comment.rating} / 5
                </p>
            </Row>
        </div>
    );
};
