/**
 * Login Page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../../components/AuthForm';
import AuthService from '../../../../application/services/AuthService';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return <AuthForm onSuccess={handleLoginSuccess} />;
};

export default LoginPage;

