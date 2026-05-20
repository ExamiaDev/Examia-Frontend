import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UadeLoginForm from '../../../components/UadeLoginForm';
import AuthService from '../../../../application/services/AuthService';

const UadeLoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return <UadeLoginForm onSuccess={handleLoginSuccess} />;
};

export default UadeLoginPage;
