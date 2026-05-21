import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthService from '../../../../application/services/AuthService';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import ExamenesContent from './components/ExamenesContent';

const DocenteDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Determinar qué contenido mostrar basado en la ruta
  const renderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/examenes')) {
      return <ExamenesContent />;
    }
    
    // Default: Mis Cursos (dashboard principal)
    return <DashboardContent />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Sidebar user={user} />
      {renderContent()}
    </Box>
  );
};

export default DocenteDashboard;
