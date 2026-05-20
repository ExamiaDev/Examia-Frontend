import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import RegisterPage from './presentation/pages/auth/register/RegisterPage';
import ForgotPasswordPage from './presentation/pages/auth/forgot-password/ForgotPasswordPage';
import UadeLoginPage from './presentation/pages/auth/uade-login/UadeLoginPage';
import Dashboard from './presentation/pages/Dashboard';

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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/uade-login" element={<UadeLoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
