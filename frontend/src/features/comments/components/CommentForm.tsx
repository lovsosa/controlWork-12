import { type FormEvent, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCommentCreateError, selectCommentCreateLoading } from '../commentsSlice';
import { createComment } from '../commentsThunks';

interface Props {
  recipeId: string;
}

const CommentForm = ({ recipeId }: Props) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectCommentCreateLoading);
  const error = useAppSelector(selectCommentCreateError);
  const [text, setText] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const serverFieldError = error && 'errors' in error ? error.errors.text?.message : undefined;
  const fieldError = clientError || serverFieldError;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setClientError('Введите текст комментария');
      return;
    }

    const result = await dispatch(createComment({ recipe: recipeId, text }));
    if (createComment.fulfilled.match(result)) {
      setText('');
    }
  };

  return (
    <Form onSubmit={onSubmit} noValidate className="mt-3">
      {error && !('errors' in error) && <Alert variant="danger">{error.error}</Alert>}
      <Form.Group className="mb-2" controlId="comment-text">
        <Form.Label>Ваш комментарий</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setClientError(null);
          }}
          isInvalid={Boolean(fieldError)}
        />
        <Form.Control.Feedback type="invalid">{fieldError}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" disabled={loading}>
        {loading && <Spinner as="span" size="sm" className="me-2" />}
        Отправить
      </Button>
    </Form>
  );
};

export default CommentForm;
