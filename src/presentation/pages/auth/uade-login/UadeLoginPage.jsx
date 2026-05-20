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

  return <UadeLoginForm />;
};

export default UadeLoginPage;
