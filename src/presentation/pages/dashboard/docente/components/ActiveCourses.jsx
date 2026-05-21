import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import {
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const courses = [
  {
    id: 1,
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 32,
    shift: 'Manana',
    shiftColor: '#001f56',
  },
  {
    id: 2,
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 28,
    shift: 'Tarde',
    shiftColor: '#0369a1',
  },
  {
    id: 3,
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 41,
    shift: 'Noche',
    shiftColor: '#374151',
  },
];

const ActiveCourses = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontWeight: 700,
          color: '#374151',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 2,
        }}
      >
        Cursos Activos
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {courses.map((course) => (
          <Paper
            key={course.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {course.name}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                  }}
                >
                  {course.year} - {course.grade}
                </Typography>
              </Box>
              <Chip
                label={course.shift}
                size="small"
                sx={{
                  backgroundColor: course.shiftColor,
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 26,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                {course.students} alumnos
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: '#e5e7eb',
                color: '#374151',
                textTransform: 'none',
                fontWeight: 500,
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#001f56',
                  backgroundColor: 'rgba(0,31,86,0.04)',
                },
              }}
            >
              Ver curso
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ActiveCourses;
