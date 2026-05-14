import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import AuthPageWrapper from './AuthPageWrapper';
import AuthService from '../../application/services/AuthService';

const AuthForm = ({ onSuccess = () => {} }) => {
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
          Plataforma de evaluación digital · Testing de Aplicaciones
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
            Mail institucional UADE
          </Typography>
          <CustomTextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            placeholder="nombre.apellido@uade.edu.ar"
            sx={{ mt: 0.5, mb: 2 }}
          />

          <Typography
            variant="caption"
            sx={{ display: 'block', color: '#001f56', fontWeight: 600, mb: 0.8, fontSize: '0.9rem' }}
          >
            Contraseña
          </Typography>
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
                      onClick={() => setShowPassword(!showPassword)}
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
              mb: 1.5,
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


        <Box
          sx={{
            mt: 2,
            pt: 1.2,
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#0052cc', fontSize: '0.75rem' }}>
            Docentes: @uade.edu.ar · Alumnos: @alumnos.uade.edu.ar
          </Typography>
        </Box>
      </Paper>
    </AuthPageWrapper>
  );
};

export default AuthForm;
