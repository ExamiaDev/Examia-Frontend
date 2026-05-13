import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { MarkEmailRead } from '@mui/icons-material';
import CustomTextField from '../../../components/CustomTextField';
import AuthPageWrapper from '../../../components/AuthPageWrapper';
import AuthAPI from '../../../../infrastructure/api/AuthAPI';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresá tu correo electrónico');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await AuthAPI.forgotPassword(email);
    } catch {
      // Silenciar errores — no revelar si el email existe o no
    } finally {
      setLoading(false);
      setSent(true);
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
        {sent ? (
          /* Estado de éxito */
          <Box sx={{ textAlign: 'center', py: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#e8f5e9',
                  borderRadius: '50%',
                  width: 72,
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MarkEmailRead sx={{ fontSize: 40, color: '#2e7d32' }} />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#001f56', mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              Revisá tu correo
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#666', mb: 3, lineHeight: 1.6, fontSize: '0.9rem' }}
            >
              Si el mail <strong>{email}</strong> está registrado en la plataforma, recibirás
              instrucciones para restablecer tu contraseña en los próximos minutos.
            </Typography>
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
              Volver al inicio de sesión
            </Button>
          </Box>
        ) : (
          /* Formulario */
          <>
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
              Recuperar contraseña
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: '#666',
                mb: 2.5,
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              Ingresá tu mail institucional y te enviaremos las instrucciones para recuperar tu
              contraseña.
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                disabled={loading}
                autoComplete="email"
                placeholder="nombre.apellido@uade.edu.ar"
                sx={{ mt: 0.5, mb: 2 }}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar instrucciones'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem' }}>
                <Link
                  component="button"
                  onClick={() => navigate('/login')}
                  underline="hover"
                  sx={{ color: '#001f56', fontWeight: 600, cursor: 'pointer' }}
                >
                  ← Volver al inicio de sesión
                </Link>
              </Typography>
            </Box>

            <Box sx={{ mt: 2, pt: 1.2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#0052cc', fontSize: '0.75rem' }}>
                Docentes: @uade.edu.ar · Alumnos: @alumnos.uade.edu.ar
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </AuthPageWrapper>
  );
};

export default ForgotPasswordPage;
