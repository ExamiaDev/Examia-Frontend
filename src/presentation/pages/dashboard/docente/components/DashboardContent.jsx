import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import QuickActions from './QuickActions';
import ActiveCourses from './ActiveCourses';
import RecentExams from './RecentExams';

const DashboardContent = () => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          py: 3,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#001f56',
              fontSize: '1.75rem',
            }}
          >
            Mis Cursos
          </Typography>
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: '0.9rem',
              mt: 0.5,
            }}
          >
            Cursos activos del periodo actual
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#001f56',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#00153d',
            },
          }}
        >
          Crear examen
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 4,
          py: 3,
        }}
      >
        <QuickActions />
        <ActiveCourses />
        <RecentExams />
      </Box>
    </Box>
  );
};

export default DashboardContent;
