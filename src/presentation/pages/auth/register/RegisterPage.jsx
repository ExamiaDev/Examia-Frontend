import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../../components/RegisterForm';
import AuthService from '../../../../application/services/AuthService';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  return <RegisterForm onSuccess={handleRegisterSuccess} />;
};

export default RegisterPage;
