import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Check,
  Email,
  Key,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import FormLayout from './FormLayout';
import AuthService from '../../application/services/AuthService';
import { labelSx, backButtonSx, primaryButtonSx } from './formStyles';

const ICON_SIZE = 48;

const Stepper = ({ activeStep }) => {
  const steps = [
    { label: 'Verificación', Icon: Email },
    { label: 'Código', Icon: Key },
    { label: 'Nueva contraseña', Icon: Lock },
  ];

  const connectorSx = (active) => ({
    position: 'absolute',
    top: ICON_SIZE / 2,
    height: '2px',
    backgroundColor: active ? '#22a06b' : '#e0e0e0',
    transition: 'background-color 0.3s',
    // each connector spans the middle third minus the two half-icons
    width: `calc(100% / 3 - ${ICON_SIZE}px)`,
  });

  return (
    <Box sx={{ mb: 3, position: 'relative' }}>
      {/* Connectors — absolutas, entre bordes de íconos */}
      <Box sx={{ ...connectorSx(activeStep > 0), left: `calc(100% / 6 + ${ICON_SIZE / 2}px)` }} />
      <Box sx={{ ...connectorSx(activeStep > 1), left: `calc(100% / 2 + ${ICON_SIZE / 2}px)` }} />

      {/* Pasos: flex:1 cada uno, ícono + label centrados */}
      <Box sx={{ display: 'flex' }}>
        {steps.map(({ label, Icon }, i) => (
          <Box
            key={label}
            sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}
          >
            <Box
              sx={{
                width: ICON_SIZE, height: ICON_SIZE, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: activeStep > i ? '#22a06b' : activeStep === i ? '#001f56' : '#e8eaf0',
                color: activeStep >= i ? '#fff' : '#9098b0',
                transition: 'background-color 0.3s',
              }}
            >
              {activeStep > i
                ? <Check sx={{ fontSize: '1.4rem' }} />
                : <Icon sx={{ fontSize: '1.3rem' }} />}
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                textAlign: 'center',
                fontSize: '0.78rem',
                fontWeight: activeStep === i ? 700 : 400,
                color: activeStep === i ? '#001f56' : '#9098b0',
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await AuthService.forgotPassword(email);
      setMaskedEmail(res.maskedEmail);
      setStep(1);
    } catch (err) {
      setError(err.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await AuthService.verifyResetCode(email, code);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await AuthService.resetPassword(email, code, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña');
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
      title="Recuperar contraseña"
      subtitle="Seguí los pasos para restablecer tu acceso"
      backButton={backButton}
    >

        <Stepper activeStep={step} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Contraseña actualizada correctamente!
            </Alert>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#001f56',
                fontWeight: 600,
                padding: '10px',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#000d2b' },
              }}
            >
              Ir al login
            </Button>
          </Box>
        ) : step === 0 ? (
          <form onSubmit={handleSendCode}>
            <Typography variant="body2" sx={{ color: '#444', mb: 2, lineHeight: 1.6 }}>
              Enviamos un código de verificación al mail registrado en tu cuenta:
            </Typography>
            <Typography variant="caption" sx={labelSx}>Mail institucional</Typography>
            <CustomTextField
              name="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              disabled={loading}
              placeholder="nombre.apellido@uade.edu.ar"
              autoComplete="email"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email}
              sx={{
                backgroundColor: '#001f56',
                fontWeight: 600,
                padding: '12px',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#000d2b' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar código'}
            </Button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleVerifyCode}>
            <Typography variant="body2" sx={{ color: '#444', mb: 1.5, lineHeight: 1.6 }}>
              Enviamos un código de verificación al mail registrado en tu cuenta:
            </Typography>
            <CustomTextField
              value={maskedEmail}
              disabled
              sx={{
                mb: 3,
                '& .MuiInputBase-input.Mui-disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  fontFamily: 'monospace',
                  WebkitTextFillColor: '#333',
                },
              }}
            />
            <Typography variant="caption" sx={labelSx}>Código de verificación</Typography>
            <CustomTextField
              name="code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null); }}
              disabled={loading}
              placeholder="000000"
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' } }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || code.length < 6}
              sx={{
                backgroundColor: '#001f56',
                fontWeight: 600,
                padding: '12px',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#000d2b' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verificar código'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                type="button"
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await AuthService.forgotPassword(email);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                underline="hover"
                sx={{ color: '#2c5cc5', fontSize: '0.85rem', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                ¿No recibiste el código? Reenviar
              </Link>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <Typography variant="caption" sx={labelSx}>Nueva contraseña</Typography>
            <CustomTextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              disabled={loading}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" disabled={loading}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2.5 }}
            />
            <Typography variant="caption" sx={labelSx}>Repetir contraseña</Typography>
            <CustomTextField
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
              disabled={loading}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" disabled={loading}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />
             <Button
               type="submit"
               fullWidth
               variant="contained"
               disabled={loading || !password || !confirmPassword}
               sx={primaryButtonSx}
             >
               {loading ? <CircularProgress size={24} color="inherit" /> : 'Restablecer contraseña'}
             </Button>
          </form>
        )}
    </FormLayout>
  );
};

ForgotPasswordForm.propTypes = {
  onSuccess: PropTypes.func,
};

ForgotPasswordForm.defaultProps = {
  onSuccess: () => {},
};

export default ForgotPasswordForm;
