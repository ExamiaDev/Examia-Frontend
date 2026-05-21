import { Box, Paper, Typography } from '@mui/material';
import AuthPageWrapper from './AuthPageWrapper';

/**
 * FormLayout - Componente de layout reutilizable para formularios de autenticación
 * Elimina duplicación de código entre AuthForm, RegisterForm, UadeLoginForm y ForgotPasswordForm
 */
const FormLayout = ({
  children,
  title,
  subtitle,
  backButton,
  showSubtitle = true,
} = {}) => (
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
      {backButton && backButton}

      {title && (
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
          {title}
        </Typography>
      )}

      {showSubtitle && subtitle && (
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: '#666', mb: 2.5, fontSize: '0.9rem' }}
        >
          {subtitle}
        </Typography>
      )}

      {children}
    </Paper>
  </AuthPageWrapper>
);

export default FormLayout;

