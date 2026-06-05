import { Box, Paper, Typography, Button, Chip, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const SHIFT_LABEL = { '1': 'Mañana', '2': 'Tarde', '3': 'Noche' };
const SHIFT_COLOR = { '1': '#001f56', '2': '#0369a1', '3': '#374151' };

const deriveCoursesFromExams = (exams) => {
  const seen = new Map();
  for (const exam of exams) {
    const key = `${exam.subjectId}__${exam.shift}`;
    if (!seen.has(key)) {
      seen.set(key, {
        id: key,
        subjectId: exam.subjectId,
        name: exam.subjectName || 'Sin nombre',
        shift: exam.shift,
        examCount: 1,
      });
    } else {
      seen.get(key).examCount += 1;
    }
  }
  return Array.from(seen.values());
};

const ActiveCourses = ({ exams, loading }) => {
  const navigate = useNavigate();
  const courses = deriveCoursesFromExams(exams);

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={120} height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={140} />
          ))}
        </Box>
      </Box>
    );
  }

  if (courses.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
          Cursos Activos
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          No hay cursos activos. Creá un examen para que aparezcan acá.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
        Cursos Activos
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {courses.map((course) => {
          const shiftLabel = SHIFT_LABEL[course.shift] || course.shift || '—';
          const shiftColor = SHIFT_COLOR[course.shift] || '#374151';
          return (
            <Paper
              key={course.id}
              elevation={0}
              sx={{ p: 3, borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '1.1rem', lineHeight: 1.3, mb: 0.5 }}>
                    {course.name}
                  </Typography>
                  <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    {course.examCount} {course.examCount === 1 ? 'examen' : 'exámenes'}
                  </Typography>
                </Box>
                <Chip
                  label={shiftLabel}
                  size="small"
                  sx={{ backgroundColor: shiftColor, color: '#fff', fontWeight: 500, fontSize: '0.75rem', height: 26 }}
                />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(`/docente/cursos/${course.subjectId}`)}
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 500,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#001f56', backgroundColor: 'rgba(0,31,86,0.04)' },
                }}
              >
                Ver curso
              </Button>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveCourses;
