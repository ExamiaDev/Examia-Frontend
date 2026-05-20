import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../../components/ForgotPasswordForm';
import AuthService from '../../../../application/services/AuthService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
