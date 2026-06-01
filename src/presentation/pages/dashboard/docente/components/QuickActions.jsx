import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const actions = [
  {
    id: 'crear-examen',
    path: '/docente/examenes/crear',
    icon: AddIcon,
    title: 'Crear examen',
    description: 'Diseña un nuevo examen',
    iconBg: '#eef2ff',
    iconColor: '#001f56',
  },
  {
    id: 'correcciones',
    path: '/docente/correcciones',
    icon: AssignmentIcon,
    title: 'Correcciones pendientes',
    description: '12 entregas por revisar',
    iconBg: '#eef2ff',
    iconColor: '#001f56',
  },
  {
    id: 'publicar',
    path: '/docente/examenes',
    icon: SendIcon,
    title: 'Publicar notas',
    description: 'Notifica a tus alumnos',
    iconBg: '#eef2ff',
    iconColor: '#001f56',
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
        mb: 4,
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Paper
            key={action.id}
            elevation={0}
            onClick={() => navigate(action.path)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(action.path);
              }
            }}
            role="button"
            tabIndex={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2.5,
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#001f56',
                boxShadow: '0 4px 12px rgba(0,31,86,0.08)',
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: action.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon sx={{ color: action.iconColor, fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#111827',
                  fontSize: '0.95rem',
                  lineHeight: 1.3,
                }}
              >
                {action.title}
              </Typography>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  mt: 0.3,
                }}
              >
                {action.description}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default QuickActions;
