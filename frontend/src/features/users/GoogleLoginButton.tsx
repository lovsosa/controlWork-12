import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../app/hooks';
import { googleLogin } from './usersThunks';

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSuccess = async (credential?: string) => {
    if (!credential) return;

    const result = await dispatch(googleLogin(credential));
    if (googleLogin.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="mt-3 d-flex justify-content-center">
      <GoogleLogin
        onSuccess={(response) => onSuccess(response.credential)}
        onError={() => toast.error('Не удалось войти через Google')}
      />
    </div>
  );
};

export default GoogleLoginButton;
