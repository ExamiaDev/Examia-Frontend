/**
 * Dashboard Page
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import AuthService from '../../application/services/AuthService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#001f56' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
              examia
            </Typography>
          </Box>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#001f56' }}>
            Bienvenido a Examia
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Hola <strong>{user?.username}</strong>, bienvenido a nuestra plataforma de evaluación.
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

