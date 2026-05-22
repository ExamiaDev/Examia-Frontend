import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import AuthService from '../../application/services/AuthService';
import { RoleEnum } from '../../domain/enums/RoleEnum';

const ROLE_LABELS = {
  ALUMNO: 'Alumno',
  DOCENTE: 'Docente',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Redirigir docentes a su dashboard especifico
    if (user.role === RoleEnum.DOCENTE) {
      navigate('/docente');
    }
  }, [navigate, user]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppBar position="static" sx={{ backgroundColor: '#001f56' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.3rem' }, flexGrow: 1 }}
          >
            examia
          </Typography>
          {user?.role && (
            <Chip
              label={ROLE_LABELS[user.role] ?? user.role}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 600,
                display: { xs: 'none', sm: 'flex' },
              }}
            />
          )}
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Paper elevation={3} sx={{ padding: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: '#001f56',
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
            }}
          >
            Bienvenido a Examia
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Hola{' '}
            <strong>
              {user ? `${user.nombre} ${user.apellido}` : ''}
            </strong>
            , bienvenido a nuestra plataforma de evaluación.
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            Este es un view preliminar del dashboard. Próximamente se agregarán más funcionalidades.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
