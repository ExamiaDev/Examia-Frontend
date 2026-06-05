import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SHIFT_LABEL = { '1': 'Mañana', '2': 'Tarde', '3': 'Noche' };

const STATUS_MAP = {
  published: { label: 'Publicado', color: '#059669', bg: '#d1fae5' },
  draft: { label: 'Borrador', color: '#d97706', bg: '#fef3c7' },
};

const getStatus = (exam) => (exam.published ? STATUS_MAP.published : STATUS_MAP.draft);

const getCourse = (exam) => {
  const shift = SHIFT_LABEL[exam.shift] || exam.shift || '';
  const parts = [exam.subjectName, shift].filter(Boolean);
  return parts.join(' - ') || '—';
};

const RecentExams = ({ exams, loading }) => {
  const navigate = useNavigate();

  const goToCorrecciones = () => navigate('/docente/correcciones');

  const recentExams = [...exams]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={160} height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}
      >
        Exámenes Recientes
      </Typography>
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {recentExams.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
              No hay exámenes creados aún.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                  {['Examen', 'Curso', 'Estado', 'Pendientes', ''].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ fontWeight: 600, color: '#374151', fontSize: '0.85rem', borderBottom: '1px solid #e5e7eb' }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recentExams.map((exam) => {
                  const status = getStatus(exam);
                  const pending = exam.pendingCorrectionsCount ?? 0;
                  return (
                    <TableRow
                      key={exam.id}
                      sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { backgroundColor: '#f9fafb' } }}
                    >
                      <TableCell sx={{ color: '#111827', fontSize: '0.9rem', fontWeight: 500, borderBottom: '1px solid #e5e7eb' }}>
                        {exam.title}
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280', fontSize: '0.9rem', borderBottom: '1px solid #e5e7eb' }}>
                        {getCourse(exam)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #e5e7eb' }}>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{ backgroundColor: status.bg, color: status.color, fontWeight: 500, fontSize: '0.75rem', height: 26 }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#111827',
                          fontSize: '0.9rem',
                          borderBottom: '1px solid #e5e7eb',
                          cursor: pending > 0 ? 'pointer' : 'default',
                          '&:hover': pending > 0 ? { color: '#001f56' } : undefined,
                        }}
                        onClick={() => pending > 0 && goToCorrecciones()}
                      >
                        {pending}
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #e5e7eb' }}>
                        <Button
                          variant="text"
                          onClick={goToCorrecciones}
                          sx={{ color: '#001f56', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem', '&:hover': { backgroundColor: 'rgba(0,31,86,0.04)' } }}
                        >
                          Abrir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

RecentExams.propTypes = {
  exams: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RecentExams;
