import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import ExamService from '../../../../../application/services/ExamService';
import { getCourseById } from './coursesData';

export default function CursoContent({ courseId }) {
  const navigate = useNavigate();
  const course = getCourseById(courseId);

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!course) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ExamService.getExams({ subjectId: course.subjectId });
        if (!mounted) return;
        const list = Array.isArray(data) ? data : (data?.content || data?.exams || []);
        setExams(list);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar los exámenes del curso');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [course]);

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Curso no encontrado.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/docente')}>Volver a Mis Cursos</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 4,
          py: 3,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Tooltip title="Volver a Mis Cursos">
            <IconButton onClick={() => navigate('/docente')} sx={{ mt: 0.25, color: '#001f56' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', fontSize: '1.75rem' }}>
                {course.name}
              </Typography>
              <Chip
                label={course.shift}
                size="small"
                sx={{ backgroundColor: course.shiftColor, color: '#fff', fontWeight: 500 }}
              />
            </Box>
            <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {course.year} · {course.grade}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <PeopleIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>
                {course.students} alumnos
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/docente/examenes/crear')}
          sx={{
            backgroundColor: '#001f56',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: '8px',
            flexShrink: 0,
            '&:hover': { backgroundColor: '#00153d' },
          }}
        >
          Crear examen
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', px: 4, py: 3 }}>
        <Typography sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
          Exámenes del curso
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#001f56' }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && exams.length === 0 && (
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#6b7280', mb: 2 }}>
              Todavía no hay exámenes para este curso.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/docente/examenes/crear')}
              sx={{ backgroundColor: '#001f56', textTransform: 'none', '&:hover': { backgroundColor: '#00153d' } }}
            >
              Crear examen
            </Button>
          </Paper>
        )}

        {!loading && !error && exams.length > 0 && (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['Examen', 'Estado', ''].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontWeight: 500, color: '#001f56' }}>
                      {exam.title || exam.nombre || '(sin título)'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={exam.published ? 'Publicado' : 'Borrador'}
                        size="small"
                        sx={{
                          bgcolor: exam.published ? '#e8f5e9' : '#f5f5f5',
                          color: exam.published ? '#2e7d32' : '#888',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/docente/correcciones/${exam.id}`)}
                        sx={{
                          backgroundColor: '#001f56',
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { backgroundColor: '#001845' },
                        }}
                      >
                        Corregí
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

CursoContent.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
