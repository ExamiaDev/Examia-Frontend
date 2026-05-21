import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import AuthPageWrapper from './AuthPageWrapper';
import AuthService from '../../application/services/AuthService';

const AuthForm = ({ onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await AuthService.login(form.email, form.password);
      setForm({ email: '', password: '' });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthPageWrapper>
      <Paper
        elevation={8}
        sx={{
          padding: { xs: 2.5, sm: 3 },
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 0.5,
            color: '#001f56',
            fontSize: { xs: '1.4rem', sm: '1.6rem' },
          }}
        >
          Iniciar sesión
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: '#666', mb: 2.5, fontSize: '0.9rem' }}
        >
          Plataforma de evaluación digital
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#001f56', fontWeight: 600, mb: 0.8, fontSize: '0.9rem' }}
          >
            Email
          </Typography>
          <CustomTextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            placeholder="tu@email.com"
            sx={{ mt: 0.5, mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
            <Typography
              variant="caption"
              sx={{ color: '#001f56', fontWeight: 600, fontSize: '0.9rem' }}
            >
              Contraseña
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => navigate('/forgot-password')}
              underline="hover"
              sx={{ fontSize: '0.82rem', color: '#2c5cc5', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
          <CustomTextField
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="mostrar contraseña"
                      onClick={handlePasswordToggle}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mt: 0.5, mb: 2.5 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 0.5,
              mb: 2,
              backgroundColor: '#001f56',
              fontWeight: 600,
              padding: '10px',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#000d2b' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
        </form>

        <Divider sx={{ my: 2, color: '#aaa', fontSize: '0.82rem' }}>O</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<School />}
          onClick={() => navigate('/uade-login')}
          sx={{
            mb: 2,
            color: '#001f56',
            borderColor: '#e0e0e0',
            backgroundColor: '#f5f5f5',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '10px',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#ebebeb', borderColor: '#c0c0c0' },
          }}
        >
          Ingresar con usuario UADE
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#555', mb: 1.5 }}>
          ¿No tenés cuenta?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
            style={{ color: '#2c5cc5', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}
          >
            Registrate
          </a>
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem' }}>
            Docentes: @uade.edu.ar · Alumnos: @alumnos.uade.edu.ar
          </Typography>
        </Box>
      </Paper>
    </AuthPageWrapper>
  );
};

AuthForm.propTypes = {
  onSuccess: PropTypes.func,
};

AuthForm.defaultProps = {
  onSuccess: () => {},
};

export default AuthForm;
