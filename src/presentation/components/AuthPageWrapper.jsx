import { Box } from '@mui/material';
import Logo from './Logo';

const AuthPageWrapper = ({ children, maxWidth = '600px' } = {}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0d2d6b',
    }}
  >
    {/* Logo */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: 3, sm: 5 },
        mb: '-4px',
        zIndex: 10,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: { xs: 100, sm: 140 },
          height: { xs: 100, sm: 140 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          p: 1,
        }}
      >
        <Logo size={120} variant="full" />
      </Box>
    </Box>

    {/* Card area */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{ width: '100%', maxWidth, mx: 'auto', px: { xs: 2, sm: 3 } }}
      >
        {children}
      </Box>
    </Box>

    {/* Footer */}
    <Box
      sx={{
        py: 1.5,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: { xs: '0.72rem', sm: '0.82rem' },
        flexShrink: 0,
      }}
    >
      © 2026 Universidad Argentina de la Empresa
    </Box>
  </Box>
);

export default AuthPageWrapper;
