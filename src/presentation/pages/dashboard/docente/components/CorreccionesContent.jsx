import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../../../../hooks/useGoBack';
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
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { usePagination } from '../../../../hooks/usePagination';
import { useSortableTable } from '../../../../hooks/useSortableTable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExamService from '../../../../../application/services/ExamService';
import SubmissionService from '../../../../../application/services/SubmissionService';

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const StatusChip = ({ status, score }) => {
  if (status === 'GRADED') {
    return (
      <Chip
        label={`Calificado: ${score}`}
        size="small"
        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }}
      />
    );
  }
  return (
    <Chip
      label="Pendiente"
      size="small"
      sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 500, fontSize: '0.75rem' }}
    />
  );
};

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// ─── Vista: lista de exámenes con conteo de entregas ──────────────────────────

const ExamsView = ({ onSelectExam, initialExamId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sorted: sortedRows, sortKey: examSortKey, sortDir: examSortDir, handleSort: handleExamSort } = useSortableTable(rows, 'pendingCount', 'desc');
  const { page: examsPage, rowsPerPage: examsRpp, handleChangePage: onExamsPage, handleChangeRowsPerPage: onExamsRpp, paginated: pagedRows } = usePagination(sortedRows);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const examsData = await ExamService.getExams();
        const examList = Array.isArray(examsData)
          ? examsData
          : (examsData?.content || examsData?.exams || []);

        // Para cada examen, cargamos sus entregas en paralelo
        const withCounts = await Promise.all(
          examList.map(async (exam) => {
            try {
              const subs = await SubmissionService.getSubmissions(exam.id);
              const subsArr = Array.isArray(subs) ? subs : [];
              const pendingCount = subsArr.filter((s) => s.status !== 'GRADED').length;
              const gradedCount = subsArr.filter((s) => s.status === 'GRADED').length;
              return { ...exam, pendingCount, gradedCount, totalSubmissions: subsArr.length };
            } catch {
              return { ...exam, pendingCount: 0, gradedCount: 0, totalSubmissions: 0 };
            }
          })
        );

        if (!mounted) return;
        setRows(withCounts);

        // Si hay un examen pre-seleccionado, abrirlo directo
        if (initialExamId) {
          const target = withCounts.find((e) => e.id === initialExamId);
          if (target) onSelectExam(target);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar los exámenes');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialExamId]);

  const totalPending = rows.reduce((acc, e) => acc + e.pendingCount, 0);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
            Correcciones pendientes
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {loading
              ? 'Cargando...'
              : totalPending > 0
              ? (totalPending === 1
                ? 'Tenés 1 entrega esperando revisión.'
                : `Tenés ${totalPending} entregas esperando revisión.`)
              : 'No hay entregas pendientes de corrección.'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#001f56' }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && rows.length === 0 && (
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', p: 6, textAlign: 'center' }}>
            <AssignmentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay exámenes creados aún
            </Typography>
          </Paper>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    { label: 'Examen', key: 'title' },
                    { label: 'Materia', key: 'subjectName' },
                    { label: 'Pendientes', key: 'pendingCount' },
                    { label: 'Calificados', key: 'gradedCount' },
                    { label: 'Total', key: 'totalSubmissions' },
                    { label: '', key: null },
                  ].map(({ label, key }) => (
                    <TableCell key={label} sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2 }}>
                      {key ? (
                        <TableSortLabel
                          active={examSortKey === key}
                          direction={examSortKey === key ? examSortDir : 'asc'}
                          onClick={() => handleExamSort(key)}
                        >
                          {label}
                        </TableSortLabel>
                      ) : label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.map((exam) => (
                  <TableRow
                    key={exam.id}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' } }}
                    onClick={() => onSelectExam(exam)}
                  >
                    <TableCell sx={{ fontWeight: 500, color: '#001f56', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {exam.title || exam.nombre || '(sin título)'}
                    </TableCell>
                    <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {exam.subjectName || exam.subjectId || '—'}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {exam.pendingCount > 0 ? (
                        <Chip
                          label={exam.pendingCount}
                          size="small"
                          sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 700, minWidth: 32 }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">0</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {exam.gradedCount}
                    </TableCell>
                    <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {exam.totalSubmissions}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onSelectExam(exam); }}
                        sx={{
                          bgcolor: '#001f56', color: '#fff', textTransform: 'none',
                          fontWeight: 500, px: 2.5, py: 0.75, borderRadius: 1,
                          '&:hover': { bgcolor: '#003080' },
                        }}
                      >
                        Ver entregas
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedRows.length}
            page={examsPage}
            onPageChange={onExamsPage}
            rowsPerPage={examsRpp}
            onRowsPerPageChange={onExamsRpp}
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

ExamsView.propTypes = {
  onSelectExam: PropTypes.func.isRequired,
  initialExamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// ─── Vista: entregas de un examen ─────────────────────────────────────────────

const SubmissionsView = ({ exam, onBack }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sorted: sortedSubs, sortKey: subSortKey, sortDir: subSortDir, handleSort: handleSubSort } = useSortableTable(submissions, 'submittedAt', 'desc');
  const { page: subsPage, rowsPerPage: subsRpp, handleChangePage: onSubsPage, handleChangeRowsPerPage: onSubsRpp, paginated: pagedSubs } = usePagination(sortedSubs);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SubmissionService.getSubmissions(exam.id);
        if (mounted) setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar las entregas');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [exam.id]);

  const pendingCount = submissions.filter((s) => s.status !== 'GRADED').length;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Tooltip title="Volver a exámenes">
            <IconButton onClick={onBack} sx={{ mt: 0.25, color: '#001f56' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
              {exam.title || exam.nombre || 'Examen'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {loading
                ? 'Cargando entregas...'
                : pendingCount > 0
                ? (pendingCount === 1
                  ? '1 entrega pendiente de corrección.'
                  : `${pendingCount} entregas pendientes de corrección.`)
                : 'Todas las entregas están corregidas.'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#001f56' }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && submissions.length === 0 && (
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Aún no hay entregas para este examen.
            </Typography>
          </Paper>
        )}

        {!loading && !error && submissions.length > 0 && (
          <>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    { label: 'Legajo', key: 'studentLegajo' },
                    { label: 'Alumno', key: 'studentName' },
                    { label: 'Entregado', key: 'submittedAt' },
                    { label: 'Estado', key: 'status' },
                    { label: 'Infracciones', key: 'violationCount' },
                    { label: '', key: null },
                  ].map(({ label, key }) => (
                    <TableCell key={label} sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2 }}>
                      {key ? (
                        <TableSortLabel
                          active={subSortKey === key}
                          direction={subSortKey === key ? subSortDir : 'asc'}
                          onClick={() => handleSubSort(key)}
                        >
                          {label}
                        </TableSortLabel>
                      ) : label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedSubs.map((sub) => (
                  <TableRow key={sub.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ color: '#666', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {sub.studentLegajo || '—'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#001f56', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {sub.studentName}
                    </TableCell>
                    <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {formatDate(sub.submittedAt)}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      <StatusChip status={sub.status} score={sub.totalScore} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {sub.violationCount > 0 ? (
                        <Chip
                          icon={<WarningAmberIcon sx={{ fontSize: '0.9rem !important' }} />}
                          label={sub.violationCount}
                          size="small"
                          sx={{ bgcolor: sub.violationCount >= 3 ? '#ffebee' : '#fff3e0', color: sub.violationCount >= 3 ? '#c62828' : '#e65100', fontWeight: 700 }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#aaa' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      <Button
                        variant={sub.status === 'GRADED' ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => navigate(`/docente/correcciones/${exam.id}/${sub.id}`)}
                        sx={{
                          bgcolor: sub.status === 'GRADED' ? 'transparent' : '#001f56',
                          color: sub.status === 'GRADED' ? '#2e7d32' : '#fff',
                          borderColor: sub.status === 'GRADED' ? '#2e7d32' : undefined,
                          textTransform: 'none', fontWeight: 500,
                          px: 2.5, py: 0.75, borderRadius: 1,
                          '&:hover': {
                            bgcolor: sub.status === 'GRADED' ? '#e8f5e9' : '#003080',
                            borderColor: sub.status === 'GRADED' ? '#2e7d32' : undefined,
                          },
                        }}
                      >
                        {sub.status === 'GRADED' ? 'Ver corrección' : 'Corregir'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={submissions.length}
            page={subsPage}
            onPageChange={onSubsPage}
            rowsPerPage={subsRpp}
            onRowsPerPageChange={onSubsRpp}
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

// ─── Componente raíz ──────────────────────────────────────────────────────────

const CorreccionesContent = ({ initialExamId }) => {
  const [view, setView] = useState('exams');
  const [selectedExam, setSelectedExam] = useState(null);
  // Si llegaron acá desde otra pantalla (ej: /docente/examenes), retrocedemos en
  // el historial real. Si entraron por deep link, vamos a la lista de exámenes
  // de correcciones (limpiando la selección interna).
  const goBackToOrigin = useGoBack('/docente/correcciones');

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setView('submissions');
  };

  const handleBack = () => {
    // Si la pantalla está embebida con un initialExamId (entrada desde "Corregí"),
    // el "atrás" debe sacar al usuario de esta vista por completo, devolviéndolo
    // al lugar real de origen (típicamente /docente/examenes).
    if (initialExamId) {
      goBackToOrigin();
      return;
    }
    setSelectedExam(null);
    setView('exams');
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {view === 'exams' && (
        <ExamsView onSelectExam={handleSelectExam} initialExamId={initialExamId} />
      )}
      {view === 'submissions' && selectedExam && (
        <SubmissionsView exam={selectedExam} onBack={handleBack} />
      )}
    </Box>
  );
};

export default CorreccionesContent;
