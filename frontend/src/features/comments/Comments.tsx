import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import {
  selectComments,
  selectCommentsLoading,
  selectDeletingCommentId,
} from './commentsSlice';
import { deleteComment, fetchComments } from './commentsThunks';
import CommentItem from './components/CommentItem';
import CommentForm from './components/CommentForm';

interface Props {
  recipeId: string;
  recipeOwnerId: string;
}

const Comments = ({ recipeId, recipeOwnerId }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const comments = useAppSelector(selectComments);
  const loading = useAppSelector(selectCommentsLoading);
  const deletingId = useAppSelector(selectDeletingCommentId);

  useEffect(() => {
    dispatch(fetchComments(recipeId));
  }, [dispatch, recipeId]);

  const canDelete = (authorId: string) =>
    Boolean(user && (user._id === authorId || user._id === recipeOwnerId));

  const onDelete = async (id: string) => {
    if (!window.confirm('Удалить комментарий?')) return;

    const result = await dispatch(deleteComment(id));
    if (deleteComment.rejected.match(result)) {
      toast.error('Не удалось удалить комментарий');
    }
  };

  return (
    <section className="mt-5">
      <h2 className="h4 mb-3">Комментарии ({comments.length})</h2>

      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <p className="text-muted">Комментариев пока нет</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDelete={canDelete(comment.author._id) ? () => onDelete(comment._id) : undefined}
            deleting={deletingId === comment._id}
          />
        ))
      )}

      {user ? (
        <CommentForm recipeId={recipeId} />
      ) : (
        <p className="mt-3">
          <Link to="/login">Войдите</Link>, чтобы оставить комментарий.
        </p>
      )}
    </section>
  );
};

export default Comments;
