import { Box, Container } from '@mui/material';
import Logo from './Logo';

const AuthPageWrapper = ({ children, maxWidth = 'sm' }) => (
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
          width: { xs: 90, sm: 130 },
          height: { xs: 90, sm: 130 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Logo size={130} variant="full" />
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
      <Container
        maxWidth={maxWidth}
        sx={{ px: { xs: 2, sm: 3 } }}
      >
        {children}
      </Container>
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
