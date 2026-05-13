/**
 * Logo Component
 */

import { Box } from '@mui/material';
import logoPng from '../../assets/logo.png';

const Logo = ({ size = 140, variant = 'full' }) => {
  // Full logo with text, icon and tagline in a square
  if (variant === 'full') {
    return (
      <Box
        component="img"
        src={logoPng}
        alt="Examia Logo"
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: '12px',
          display: 'block',
        }}
      />
    );
  }

  // Icon only (for header)
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src={logoPng}
        alt="Examia"
        sx={{
          width: '85%',
          height: '85%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default Logo;

