import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthService from '../../../../application/services/AuthService';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';

const DocenteDashboard = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Solo permitir acceso a profesores
    if (user.role !== RoleEnum.PROFESOR) {
      navigate('/dashboard');
    }
  }, [navigate, user]);

  if (!user || user.role !== RoleEnum.PROFESOR) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Sidebar user={user} />
      <DashboardContent />
    </Box>
  );
};

export default DocenteDashboard;
