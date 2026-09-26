import { Container } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-6">404</h1>
      <p className="text-muted">Страница не найдена</p>
    </Container>
  );
};

export default NotFound;
