import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import { register } from './usersThunks';
import GoogleLoginButton from './GoogleLoginButton';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
    displayName: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const fieldError = (field: string) => error?.errors[field]?.message;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register(state));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Регистрация</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={state.email}
            onChange={onChange}
            required
            isInvalid={Boolean(fieldError('email'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('email')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-displayName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            name="displayName"
            value={state.displayName}
            onChange={onChange}
            required
            isInvalid={Boolean(fieldError('displayName'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('displayName')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            onChange={onChange}
            required
            isInvalid={Boolean(fieldError('password'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('password')}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          {loading && <Spinner as="span" size="sm" className="me-2" />}
          Зарегистрироваться
        </Button>
      </Form>

      <GoogleLoginButton />

      <p className="text-center mt-3 mb-0">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </Container>
  );
};

export default Register;
