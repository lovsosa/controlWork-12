import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import UserMenu from './UserMenu';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Книга рецептов
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-md-center">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Регистрация
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Вход
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppToolbar;
