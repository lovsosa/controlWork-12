import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import { login } from './usersThunks';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(state));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Вход</h1>

      {error && <Alert variant="danger">{error.error}</Alert>}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={state.email}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
          {loading && <Spinner as="span" size="sm" className="me-2" />}
          Войти
        </Button>
      </Form>

      <GoogleLoginButton />

      <p className="text-center mt-3 mb-0">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </Container>
  );
};

export default Login;
