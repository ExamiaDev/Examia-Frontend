import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthService from '../../../../application/services/AuthService';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import ExamenesContent from './components/ExamenesContent';
import CorreccionesContent from './components/CorreccionesContent';
import CorreccionDetalleContent from './components/CorreccionDetalleContent';
import CrearExamenContent from './components/CrearExamenContent';
import CursoContent from './components/CursoContent';
import MetricasContent from './components/MetricasContent';

const DocenteDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Solo permitir acceso a docentes
    if (user.role !== RoleEnum.DOCENTE) {
      navigate('/dashboard');
    }
  }, [navigate, user]);

  if (!user || user.role !== RoleEnum.DOCENTE) {
    return null;
  }

  // Determinar qué contenido mostrar basado en la ruta
  const renderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/examenes/crear')) {
      return <CrearExamenContent />;
    }

    if (path.includes('/cursos/')) {
      const segments = path.split('/').filter(Boolean);
      return <CursoContent courseId={segments[2]} />;
    }
    
    if (path.includes('/examenes')) {
      return <ExamenesContent />;
    }
    
    if (path.includes('/correcciones')) {
      const segments = path.split('/').filter(Boolean);
      // ['docente', 'correcciones', examId, submissionId]
      if (segments.length >= 4) {
        // /docente/correcciones/:examId/:submissionId → corrección individual
        return <CorreccionDetalleContent examId={segments[2]} submissionId={segments[3]} />;
      }
      if (segments.length === 3) {
        // /docente/correcciones/:examId → pre-seleccionar examen (viene desde Exámenes)
        return <CorreccionesContent initialExamId={segments[2]} />;
      }
      return <CorreccionesContent />;
    }
    
    if (path.includes('/metricas')) {
      return <MetricasContent />;
    }
    
    // Default: Mis Cursos (dashboard principal)
    return <DashboardContent />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Sidebar user={user} />
      <Box sx={{ flex: 1, marginLeft: '240px', minHeight: '100vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DocenteDashboard;
