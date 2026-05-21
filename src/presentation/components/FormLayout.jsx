<<<<<<< HEAD
import PropTypes from 'prop-types';
import { Box, Paper, Typography } from '@mui/material';
=======
import { Paper, Typography } from '@mui/material';
>>>>>>> 082eeed07c27a956eb6894403587ce82a9970195
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
      {backButton}

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

<<<<<<< HEAD
FormLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backButton: PropTypes.node,
  showSubtitle: PropTypes.bool,
};

FormLayout.defaultProps = {
  children: null,
  title: null,
  subtitle: null,
  backButton: null,
  showSubtitle: true,
};

=======
>>>>>>> 082eeed07c27a956eb6894403587ce82a9970195
export default FormLayout;
