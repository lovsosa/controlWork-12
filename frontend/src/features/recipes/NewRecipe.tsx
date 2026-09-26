import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RecipeMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import {
  clearCreateError,
  selectRecipeCreateError,
  selectRecipeCreateLoading,
} from './recipesSlice';
import { createRecipe } from './recipesThunks';

type FieldErrors = Partial<Record<keyof RecipeMutation, string>>;

const validate = (state: RecipeMutation): FieldErrors => {
  const errors: FieldErrors = {};

  if (!state.title.trim()) errors.title = 'Заполните название блюда';
  if (!state.description.trim()) errors.description = 'Заполните текст рецепта';
  if (!state.image) errors.image = 'Выберите фото блюда';

  return errors;
};

const NewRecipe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectRecipeCreateLoading);
  const error = useAppSelector(selectRecipeCreateError);

  const [state, setState] = useState<RecipeMutation>({
    title: '',
    description: '',
    image: null,
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  useEffect(() => {
    dispatch(clearCreateError());
  }, [dispatch]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const clearFieldError = (name: string) => {
    setClientErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setState((prev) => ({ ...prev, image: files && files[0] ? files[0] : null }));
    clearFieldError('image');
  };

  const fieldError = (field: keyof RecipeMutation) => {
    if (clientErrors[field]) return clientErrors[field];

    if (error && 'errors' in error) {
      return error.errors[field]?.message;
    }

    return undefined;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validate(state);
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await dispatch(createRecipe(state));
    if (createRecipe.fulfilled.match(result)) {
      navigate(`/authors/${user._id}`);
    }
  };

  return (
    <Container className="pb-4" style={{ maxWidth: 620 }}>
      <h1 className="h3 mb-4">Новый рецепт</h1>

      {error && !('errors' in error) && <Alert variant="danger">{error.error}</Alert>}

      <Form onSubmit={onSubmit} noValidate>
        <Form.Group className="mb-3" controlId="recipe-title">
          <Form.Label>Название блюда</Form.Label>
          <Form.Control
            name="title"
            value={state.title}
            onChange={onChange}
            isInvalid={Boolean(fieldError('title'))}
          />
          <Form.Control.Feedback type="invalid">{fieldError('title')}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="recipe-description">
          <Form.Label>Рецепт</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            name="description"
            value={state.description}
            onChange={onChange}
            isInvalid={Boolean(fieldError('description'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('description')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="recipe-image">
          <Form.Label>Фото блюда</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={onFileChange}
            isInvalid={Boolean(fieldError('image'))}
          />
          <Form.Control.Feedback type="invalid">{fieldError('image')}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="success" disabled={loading}>
          {loading && <Spinner as="span" size="sm" className="me-2" />}
          Опубликовать рецепт
        </Button>
      </Form>
    </Container>
  );
};

export default NewRecipe;
