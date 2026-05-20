import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import AuthPageWrapper from './AuthPageWrapper';
import AuthService from '../../application/services/AuthService';

const UadeLoginForm = ({ onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', legajo: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      await AuthService.loginUade(form.email, form.legajo, form.password);
      setForm({ email: '', legajo: '', password: '' });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con UADE');
    } finally {
      setLoading(false);
    }
  };

  const labelSx = {
    color: '#001f56',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'block',
    mb: 0.8,
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
        <Link
          component="button"
          type="button"
          onClick={() => navigate('/login')}
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#666',
            fontSize: '0.85rem',
            mb: 2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowBack sx={{ fontSize: '1rem' }} />
          Volver al login
        </Link>

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
          Ingresar con usuario UADE
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: '#666', mb: 3, fontSize: '0.9rem' }}
        >
          Acceso unificado institucional
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="caption" sx={labelSx}>
            Número de Legajo
          </Typography>
          <CustomTextField
            name="legajo"
            type="text"
            value={form.legajo}
            onChange={handleChange}
            placeholder="Ej: 1234567"
            autoComplete="off"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>
            Mail institucional UADE
          </Typography>
          <CustomTextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nombre.apellido@uade.edu.ar"
            autoComplete="email"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>
            Contraseña UADE
          </Typography>
          <CustomTextField
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !form.email || !form.legajo || !form.password}
            sx={{
              backgroundColor: '#001f56',
              fontWeight: 600,
              padding: '12px',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#000d2b' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
        </form>

        <Box sx={{ mt: 2.5, p: 2, backgroundColor: '#f5f7ff', borderRadius: 2, border: '1px solid #dce3f5' }}>
          <Typography variant="caption" sx={{ color: '#555', fontSize: '0.8rem', display: 'block', textAlign: 'center' }}>
            Los usuarios UADE están precargados en el sistema. No es necesario registrarse.
          </Typography>
        </Box>
      </Paper>
    </AuthPageWrapper>
  );
};

export default UadeLoginForm;
