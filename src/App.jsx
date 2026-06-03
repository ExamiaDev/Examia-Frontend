import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import RegisterPage from './presentation/pages/auth/register/RegisterPage';
import UadeLoginPage from './presentation/pages/auth/uade-login/UadeLoginPage';
import ForgotPasswordPage from './presentation/pages/auth/forgot-password/ForgotPasswordPage';
import Dashboard from './presentation/pages/Dashboard';
import DocenteDashboard from './presentation/pages/dashboard/docente/DocenteDashboard';
import AlumnoDashboard from './presentation/pages/dashboard/alumno/AlumnoDashboard';
import SessionExpiredModal from './presentation/components/SessionExpiredModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#001f56',
      light: '#003d9f',
      dark: '#000d2b',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#0d2d6b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);

  const handleSessionExpiredClose = () => {
    setSessionExpired(false);
    navigate('/login');
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/uade-login" element={<UadeLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/docente" element={<DocenteDashboard />} />
        <Route path="/docente/*" element={<DocenteDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/alumno/*" element={<AlumnoDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <SessionExpiredModal open={sessionExpired} onClose={handleSessionExpiredClose} />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
