import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Typography,
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import FormLayout from './FormLayout';
import AuthService from '../../application/services/AuthService';
import { labelSx, backButtonSx, primaryButtonDisabledSx } from './formStyles';

const INITIAL_FORM = {
  nombre: '',
  apellido: '',
  username: '',
  email: '',
  recoveryEmail: '',
  password: '',
  confirmPassword: '',
  role: 'ALUMNO',
};

const RegisterForm = ({ onSuccess = () => {} }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await AuthService.register({
        nombre: form.nombre,
        apellido: form.apellido,
        username: form.username,
        email: form.email,
        recoveryEmail: form.recoveryEmail,
        password: form.password,
        role: form.role,
      });
      setForm(INITIAL_FORM);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al registrarse');
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
      title="Crear cuenta"
      subtitle="Regístrate para acceder a Examia"
      backButton={backButton}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography variant="caption" sx={labelSx}>Nombre</Typography>
          <CustomTextField
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            disabled={loading}
            autoComplete="given-name"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Apellido</Typography>
          <CustomTextField
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            disabled={loading}
            autoComplete="family-name"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Nombre de usuario</Typography>
          <CustomTextField
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="sin espacios"
            autoComplete="username"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Mail principal</Typography>
          <CustomTextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Mail de recupero de contraseña</Typography>
          <CustomTextField
            name="recoveryEmail"
            type="email"
            value={form.recoveryEmail}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Contraseña</Typography>
          <CustomTextField
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={labelSx}>Repetir contraseña</Typography>
          <CustomTextField
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 1.5 }}
          />

          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <FormLabel
              component="legend"
              sx={{
                color: '#001f56',
                fontWeight: 600,
                fontSize: '0.9rem',
                '&.Mui-focused': { color: '#001f56' }
              }}
            >
              ¿Cuál es tu rol?
            </FormLabel>
            <RadioGroup
              row
              name="role"
              value={form.role}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value="ALUMNO"
                control={
                  <Radio
                    disabled={loading}
                    sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }}
                  />
                }
                label="Alumno"
              />
              <FormControlLabel
                value="PROFESOR"
                control={
                  <Radio
                    disabled={loading}
                    sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }}
                  />
                }
                label="Profesor"
              />
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
                size="small"
                sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#333' }}>
                Acepto los términos y condiciones
              </Typography>
            }
            sx={{ mb: 2 }}
          />

           <Button
             type="submit"
             fullWidth
             variant="contained"
             disabled={loading || !termsAccepted}
             sx={primaryButtonDisabledSx}
           >
             {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
           </Button>
        </form>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#555' }}>
          ¿Ya tenés cuenta?{' '}
          <Box
            component="button"
            type="button"
            onClick={() => navigate('/login')}
            sx={{ color: '#2c5cc5', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Iniciar sesión
          </Box>
        </Typography>
    </FormLayout>
  );
};

RegisterForm.propTypes = {
  onSuccess: PropTypes.func,
};

RegisterForm.defaultProps = {
  onSuccess: () => {},
};

export default RegisterForm;
