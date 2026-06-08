import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthService from '../../../../application/services/AuthService';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import AlumnoSidebar from './components/AlumnoSidebar';
import ExamenesDisponiblesContent from './components/ExamenesDisponiblesContent';
import RealizarExamenContent from './components/RealizarExamenContent';
import MisResultadosContent from './components/MisResultadosContent';
import ResultadoDetalleContent from './components/ResultadoDetalleContent';

const AlumnoDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== RoleEnum.ALUMNO) {
      navigate('/dashboard');
    }
  }, [navigate, user]);

  if (!user || user.role !== RoleEnum.ALUMNO) {
    return null;
  }

  const renderContent = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    // /alumno/examenes/:examId
    if (segments.length >= 3 && segments[1] === 'examenes') {
      return <RealizarExamenContent examId={segments[2]} />;
    }
    // /alumno/resultados/:submissionId
    if (segments.length >= 3 && segments[1] === 'resultados') {
      return <ResultadoDetalleContent submissionId={segments[2]} />;
    }
    // /alumno/resultados
    if (segments.length >= 2 && segments[1] === 'resultados') {
      return <MisResultadosContent />;
    }
    return <ExamenesDisponiblesContent />;
  };

  const segments = location.pathname.split('/').filter(Boolean);
  const isExamPage = segments.length >= 3 && segments[1] === 'examenes';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {!isExamPage && <AlumnoSidebar user={user} />}
      <Box sx={{ flex: 1, marginLeft: isExamPage ? 0 : '240px', minHeight: '100vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AlumnoDashboard;
