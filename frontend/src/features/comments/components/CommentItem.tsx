import { Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Comment } from '../../../interfaces';

interface Props {
  comment: Comment;
  onDelete?: () => void;
  deleting?: boolean;
}

const CommentItem = ({ comment, onDelete, deleting }: Props) => {
  return (
    <Card className="mb-2">
      <Card.Body className="py-2">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <Link to={`/authors/${comment.author._id}`} className="fw-semibold">
              {comment.author.displayName}
            </Link>
            <small className="text-muted ms-2">
              {dayjs(comment.createdAt).format('DD.MM.YYYY HH:mm')}
            </small>
          </div>
          {onDelete && (
            <Button variant="outline-danger" size="sm" onClick={onDelete} disabled={deleting}>
              {deleting && <Spinner as="span" size="sm" className="me-2" />}
              Удалить
            </Button>
          )}
        </div>
        <Card.Text className="mt-1 mb-0 recipe-text">{comment.text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CommentItem;
