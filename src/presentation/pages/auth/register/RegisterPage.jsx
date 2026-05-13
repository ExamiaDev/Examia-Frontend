import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CustomTextField from '../../../components/CustomTextField';
import AuthPageWrapper from '../../../components/AuthPageWrapper';
import AuthService from '../../../../application/services/AuthService';

const FieldLabel = ({ children }) => (
  <Typography
    variant="caption"
    sx={{ display: 'block', color: '#001f56', fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}
  >
    {children}
  </Typography>
);

const Field = ({ label, children }) => (
  <Box>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </Box>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (AuthService.isAuthenticated()) navigate('/dashboard');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email,
        password: form.password,
        role: 'ALUMNO',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const eye = (visible, toggle) => ({
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton size="small" onClick={toggle} edge="end" disabled={loading}>
            {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </IconButton>
        </InputAdornment>
      ),
    },
  });

  return (
    <AuthPageWrapper>
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2.5, sm: 3 },
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 0.3,
            color: '#001f56',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
          }}
        >
          Crear cuenta
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: '#666', mb: 2, fontSize: '0.85rem' }}
        >
          Plataforma de evaluación digital · Testing de Aplicaciones
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Grid 2 columnas en desktop, 1 en mobile */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
              mb: 2,
            }}
          >
            <Field label="Nombre">
              <CustomTextField
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                disabled={loading}
                autoComplete="given-name"
                placeholder="Juan"
              />
            </Field>

            <Field label="Apellido">
              <CustomTextField
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                disabled={loading}
                autoComplete="family-name"
                placeholder="García"
              />
            </Field>

            <Field label="Contraseña">
              <CustomTextField
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                slotProps={eye(showPassword, () => setShowPassword(!showPassword))}
              />
            </Field>

            <Field label="Confirmar contraseña">
              <CustomTextField
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                slotProps={eye(showConfirm, () => setShowConfirm(!showConfirm))}
              />
            </Field>
            <Field label="Mail institucional">
              <CustomTextField
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                placeholder="nombre@uade.edu.ar"
              />
            </Field>


          </Box>

          {/* Botón centrado */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#001f56',
                fontWeight: 600,
                py: 1.1,
                px: 6,
                fontSize: '0.95rem',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#000d2b' },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear cuenta'}
            </Button>
          </Box>
        </form>

        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
            ¿Ya tenés cuenta?{' '}
            <Link
              component="button"
              onClick={() => navigate('/login')}
              underline="hover"
              sx={{ color: '#001f56', fontWeight: 600, cursor: 'pointer' }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#0052cc', fontSize: '0.72rem' }}>
            Docentes: @uade.edu.ar · Alumnos: @alumnos.uade.edu.ar
          </Typography>
        </Box>
      </Paper>
    </AuthPageWrapper>
  );
};

export default RegisterPage;
