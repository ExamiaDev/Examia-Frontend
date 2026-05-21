import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import FormLayout from './FormLayout';
import AuthService from '../../application/services/AuthService';
import { labelSx, backButtonSx, primaryButtonSx } from './formStyles';

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

  const backButton = (
    <Box
      component="button"
      type="button"
      onClick={() => navigate('/login')}
      sx={backButtonSx}
    >
      <ArrowBack sx={{ fontSize: '1rem' }} />
      Volver al login
    </Box>
  );

  return (
    <FormLayout
      title="Ingresar con usuario UADE"
      subtitle="Acceso unificado institucional"
      backButton={backButton}
    >
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
          sx={primaryButtonSx}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
        </Button>
      </form>

      <Box sx={{ mt: 2.5, p: 2, backgroundColor: '#f5f7ff', borderRadius: 2, border: '1px solid #dce3f5' }}>
        <Typography variant="caption" sx={{ color: '#555', fontSize: '0.8rem', display: 'block', textAlign: 'center' }}>
          Los usuarios UADE están precargados en el sistema. No es necesario registrarse.
        </Typography>
      </Box>
    </FormLayout>
  );
};

UadeLoginForm.propTypes = {
  onSuccess: PropTypes.func,
};

UadeLoginForm.defaultProps = {
  onSuccess: () => {},
};

export default UadeLoginForm;
