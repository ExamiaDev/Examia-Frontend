/**
 * Auth Form Component
 * Handles both login and register forms
 */

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
  Divider,
  Container,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CustomTextField from './CustomTextField';
import Logo from './Logo';
import AuthService from '../../application/services/AuthService';

const AuthForm = ({ onSuccess = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state for login
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // Form state for register
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.login(loginForm.username, loginForm.password);
      setLoginForm({ username: '', password: '' });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate confirm password
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      );
      setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
      // After successful registration, switch to login
      setIsLogin(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setLoginForm({ username: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0d2d6b',
        padding: 2,
      }}
    >
      {/* Logo - Outside the Paper */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: -0.5,
          marginTop: 6,
          zIndex: 10,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            width: 150,
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo size={150} variant="full" />
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              padding: 3,
              width: '100%',
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            marginBottom: 0.5,
            color: '#001f56',
            fontSize: '1.6rem',
          }}
        >
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#666',
            marginBottom: 2.5,
            fontSize: '0.9rem',
          }}
        >
          Plataforma de evaluación digital · Testing de Aplicaciones
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLoginSubmit}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#001f56',
                fontWeight: 600,
                marginBottom: 0.8,
                fontSize: '0.9rem',
              }}
            >
              Mail institucional UADE
            </Typography>
            <CustomTextField
              name="username"
              type="text"
              value={loginForm.username}
              onChange={handleLoginChange}
              disabled={loading}
              autoComplete="email"
              placeholder="nombre.apellido@uade.edu.ar"
              sx={{ marginBottom: 2 }}
            />

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#001f56',
                fontWeight: 600,
                marginBottom: 0.8,
                fontSize: '0.9rem',
              }}
            >
              Contraseña
            </Typography>
            <CustomTextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={handleLoginChange}
              disabled={loading}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2.5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 1.5,
                marginBottom: 1.5,
                backgroundColor: '#001f56',
                fontWeight: 600,
                padding: '10px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#000d2b',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Ingresar'}
            </Button>
          </form>
        )}

        {/* Register Form */}
        {!isLogin && (
          <form onSubmit={handleRegisterSubmit}>
            <CustomTextField
              label="Usuario"
              name="username"
              type="text"
              value={registerForm.username}
              onChange={handleRegisterChange}
              disabled={loading}
              autoComplete="username"
              sx={{ marginBottom: 1 }}
            />
            <CustomTextField
              label="Correo Electrónico"
              name="email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              disabled={loading}
              autoComplete="email"
              sx={{ marginBottom: 1 }}
            />
            <CustomTextField
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={registerForm.password}
              onChange={handleRegisterChange}
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 1 }}
            />
            <CustomTextField
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 1.5,
                marginBottom: 1.5,
                backgroundColor: '#001f56',
                fontWeight: 600,
                padding: '10px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#000d2b',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
          </form>
        )}

        {/* Divider */}
        <Divider sx={{ marginY: 1.2 }}>O</Divider>

        {/* Toggle Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={toggleAuthMode}
          disabled={loading}
          sx={{
            color: '#001f56',
            borderColor: '#001f56',
            fontWeight: 600,
            marginBottom: 1.5,
            '&:hover': {
              borderColor: '#000d2b',
              backgroundColor: '#f5f7fa',
            },
          }}
        >
          {isLogin ? '¿No tenés cuenta? Regístrate' : '¿Ya tenés cuenta? Inicia sesión'}
        </Button>

        {/* Footer */}
        <Box
          sx={{
            marginTop: 1.5,
            paddingTop: 1.2,
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#0052cc',
              fontSize: '0.75rem',
            }}
          >
            Docentes: @uade.edu.ar · Alumnos: @alumnos.uade.edu.ar
          </Typography>
        </Box>
          </Paper>
        </Container>
      </Box>

      {/* Copyright Footer */}
      <Box
        sx={{
          paddingBottom: 2,
          textAlign: 'center',
          color: '#ffffff',
          fontSize: '0.85rem',
        }}
      >
        © 2026 Universidad Argentina de la Empresa
      </Box>
    </Box>
  );
};

export default AuthForm;

