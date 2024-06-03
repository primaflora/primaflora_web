import { Images } from '../../../../../../assets';
import { Row } from '../../../../../../components/common';
import { TCommentsSectionProps } from './types';
import { Comment } from '../Comment';
import './styles.css';

export const CommentSection = ({ comments }: TCommentsSectionProps) => {
    return (
        <div className="comments">
            <Row style={{ justifyContent: 'start' }}>
                <h1 className="comments-title pr-24">Відгуки</h1>
                <Row style={{ width: 'fit-content' }}>
                    <p className="small-text pr-4">{comments.length}</p>
                    <img src={Images.CommentIcon} alt="comment" />
                </Row>
            </Row>

            {comments.map(comment => (
                <Comment key={comment.uuid} comment={comment} />
            ))}
        </div>
    );
};
