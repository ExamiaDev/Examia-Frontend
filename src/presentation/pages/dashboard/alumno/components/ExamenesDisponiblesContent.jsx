import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExamAPI from '../../../../../infrastructure/api/ExamAPI';
import SubmissionService from '../../../../../application/services/SubmissionService';
import { usePagination } from '../../../../hooks/usePagination';
import { useSortableTable } from '../../../../hooks/useSortableTable';

const ExamenesDisponiblesContent = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [submittedExamIds, setSubmittedExamIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('todos');

  const subjects = [...new Set(exams.map((e) => e.subjectName || e.subjectId).filter(Boolean))];
  const filteredExams = selectedSubject === 'todos'
    ? exams
    : exams.filter((e) => (e.subjectName || e.subjectId) === selectedSubject);
  const pendingCount = filteredExams.filter((e) => !submittedExamIds.has(e.id)).length;

  const { sorted: sortedExams, sortKey, sortDir, handleSort } = useSortableTable(filteredExams);
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginated: pagedExams } = usePagination(sortedExams);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [examsData, mySubmissions] = await Promise.all([
          ExamAPI.getPublishedExams(),
          SubmissionService.getMySubmissions().catch(() => []),
        ]);
        if (!mounted) return;
        setExams(Array.isArray(examsData) ? examsData : []);
        const ids = new Set((Array.isArray(mySubmissions) ? mySubmissions : []).map((s) => s.examId));
        setSubmittedExamIds(ids);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar los exámenes');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
            Exámenes Disponibles
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {loading
              ? 'Cargando...'
              : filteredExams.length > 0
              ? `${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''} de ${filteredExams.length} examen${filteredExams.length !== 1 ? 'es' : ''} disponible${filteredExams.length !== 1 ? 's' : ''}.`
              : 'No hay exámenes disponibles en este momento.'}
          </Typography>
        </Box>
        {!loading && subjects.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Materia</InputLabel>
            <Select
              value={selectedSubject}
              label="Materia"
              onChange={(e) => { setSelectedSubject(e.target.value); handleChangePage(null, 0); }}
            >
              <MenuItem value="todos">Todas las materias</MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#001f56' }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && filteredExams.length === 0 && (
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', p: 6, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay exámenes disponibles por el momento
            </Typography>
          </Paper>
        )}

        {!loading && !error && filteredExams.length > 0 && (
          <>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    { label: 'Examen', key: 'title' },
                    { label: 'Materia', key: 'subjectName' },
                    { label: 'Preguntas', key: 'questionCount' },
                    { label: 'Puntaje', key: 'totalPoints' },
                    { label: 'Duración', key: 'durationMinutes' },
                    { label: '', key: null },
                  ].map(({ label, key }) => (
                    <TableCell
                      key={label}
                      sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2 }}
                    >
                      {key ? (
                        <TableSortLabel
                          active={sortKey === key}
                          direction={sortKey === key ? sortDir : 'asc'}
                          onClick={() => handleSort(key)}
                        >
                          {label}
                        </TableSortLabel>
                      ) : label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedExams.map((exam) => {
                  const done = submittedExamIds.has(exam.id);
                  return (
                    <TableRow key={exam.id} sx={{ '&:hover': { bgcolor: '#fafafa' }, opacity: done ? 0.75 : 1 }}>
                      <TableCell sx={{ fontWeight: 500, color: '#001f56', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        {exam.title || '(sin título)'}
                      </TableCell>
                      <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        {exam.subjectName || exam.subjectId || '—'}
                      </TableCell>
                      <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        {exam.questionCount ?? '—'}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        <Chip
                          label={`${exam.totalPoints ?? '?'} pts`}
                          size="small"
                          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        {exam.durationMinutes ? `${exam.durationMinutes} min` : '—'}
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={done}
                          onClick={() => !done && navigate(`/alumno/examenes/${exam.id}`)}
                          sx={{
                            bgcolor: done ? undefined : '#001f56',
                            color: done ? undefined : '#fff',
                            textTransform: 'none',
                            fontWeight: 500, px: 2.5, py: 0.75, borderRadius: 1,
                            '&:hover': { bgcolor: '#003080' },
                          }}
                        >
                          {done ? 'Entregado' : 'Realizar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedExams.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            sx={{ borderTop: '1px solid #e0e0e0' }}
          />
          </>
        )}
      </Box>
    </>
  );
};

export default ExamenesDisponiblesContent;
