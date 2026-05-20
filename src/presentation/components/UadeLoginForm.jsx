import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import AuthPageWrapper from './AuthPageWrapper';

const UadeLoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticación UADE pendiente de implementar
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
            Mail institucional UADE
          </Typography>
          <CustomTextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="nombre.apellido@uade.edu.ar"
            autoComplete="email"
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
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!form.email || !form.password}
            sx={{
              backgroundColor: '#001f56',
              fontWeight: 600,
              padding: '12px',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#000d2b' },
            }}
          >
            Ingresar
          </Button>
        </form>

        <Box sx={{ mt: 2.5, p: 2, backgroundColor: '#f5f7ff', borderRadius: 2, border: '1px solid #dce3f5' }}>
          <Typography variant="caption" sx={{ color: '#555', fontSize: '0.8rem', display: 'block', textAlign: 'center' }}>
            La integración con el sistema de autenticación UADE está pendiente de implementación.
          </Typography>
        </Box>
      </Paper>
    </AuthPageWrapper>
  );
};

export default UadeLoginForm;
