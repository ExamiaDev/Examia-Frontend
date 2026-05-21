import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import AuthService from '../../../../../application/services/AuthService';
import Logo from '../../../../components/Logo';

const menuItems = [
  { id: 'mis-cursos', label: 'Mis Cursos', icon: MenuBookIcon, path: '/docente' },
  { id: 'examenes', label: 'Examenes', icon: DescriptionIcon, path: '/docente/examenes' },
  { id: 'correcciones', label: 'Correcciones Pendientes', icon: AssignmentIcon, path: '/docente/correcciones' },
  { id: 'metricas', label: 'Metricas', icon: BarChartIcon, path: '/docente/metricas' },
];

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/docente') {
      return location.pathname === '/docente' || location.pathname === '/docente/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: '#001f56',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo y nombre */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#fff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Logo size={36} variant="full" />
        </Box>
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              lineHeight: 1.2,
            }}
          >
            Examia
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            UADE
          </Typography>
        </Box>
      </Box>

      {/* Menu de navegacion */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <ListItem key={item.id} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: active
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(255,255,255,0.08)',
                  },
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon sx={{ color: '#fff', fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: active ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Usuario y cerrar sesion */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          p: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {user?.nombre} {user?.apellido?.charAt(0)}.
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.75rem',
            }}
          >
            {user?.email}
          </Typography>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            py: 1,
            px: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar sesion"
            primaryTypographyProps={{
              sx: {
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.85rem',
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
