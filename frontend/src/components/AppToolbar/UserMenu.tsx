import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import type { User } from '../../interfaces';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/users/usersThunks';

interface Props {
  user: User;
}

const UserMenu = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Nav.Link as={NavLink} to={`/authors/${user._id}`} className="fw-semibold">
        {user.displayName}
      </Nav.Link>
      <NavDropdown title="Меню" id="user-menu" align="end">
        <NavDropdown.Item as={Link} to={`/authors/${user._id}`}>
          Мои рецепты
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/recipes/new">
          Добавить рецепт
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => dispatch(logout())}>Выйти</NavDropdown.Item>
      </NavDropdown>
    </>
  );
};

export default UserMenu;
