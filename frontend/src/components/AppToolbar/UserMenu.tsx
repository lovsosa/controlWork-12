import { NavDropdown } from 'react-bootstrap';
import type { User } from '../../interfaces';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/users/usersThunks';

interface Props {
  user: User;
}

const UserMenu = ({ user }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <NavDropdown title={user.displayName} id="user-menu" align="end">
      <NavDropdown.Item onClick={() => dispatch(logout())}>Выйти</NavDropdown.Item>
    </NavDropdown>
  );
};

export default UserMenu;
