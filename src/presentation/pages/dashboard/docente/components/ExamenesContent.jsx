import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Switch,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ExamService from '../../../../../application/services/ExamService';
import httpClient from '../../../../../infrastructure/http/httpClient';

const STATUS_CONFIG = {
  ACTIVO:    { label: 'Activo',    color: '#1b5e20', bg: '#e8f5e9' },
  PUBLICADO: { label: 'Publicado', color: '#0d47a1', bg: '#e3f2fd' },
  BORRADOR:  { label: 'Borrador',  color: '#616161', bg: '#f5f5f5' },
};

function getExamStatus(exam) {
  if (!exam.published) return 'BORRADOR';
  const now = new Date();
  const start = exam.scheduledStartTime ? new Date(exam.scheduledStartTime) : null;
  const end   = exam.scheduledEndTime   ? new Date(exam.scheduledEndTime)   : null;
  if (start && now >= start && (!end || now <= end)) return 'ACTIVO';
  return 'PUBLICADO';
}

export default function ExamenesContent() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [monitoreoExam, setMonitoreoExam] = useState(null);
  const [monitoreoSubs, setMonitoreoSubs] = useState([]);
  const [monitoreoLoading, setMonitoreoLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ExamService.getExams();
        if (mounted) {
          // Soportamos respuestas tipo array o { content: [...] } (paginadas)
          const list = Array.isArray(data) ? data : (data?.content || data?.exams || []);
          setExams(list);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Error al obtener los exámenes');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchExams();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCrearExamen = () => {
    navigate('/docente/examenes/crear');
  };

  const handleDeleteConfirm = async () => {
    const exam = deleteTarget;
    setDeleteTarget(null);
    setExams((prev) => prev.filter((e) => e.id !== exam.id));
    try {
      await httpClient.delete(`/exams/${exam.id}`);
    } catch {
      // revertir si falla
      setExams((prev) => [...prev, exam]);
    }
  };

  const handleMonitoreoClick = async (exam) => {
    setMonitoreoExam(exam);
    setMonitoreoSubs([]);
    setMonitoreoLoading(true);
    try {
      const response = await httpClient.get(`/exams/${exam.id}/submissions`);
      setMonitoreoSubs(Array.isArray(response.data) ? response.data : []);
    } catch {
      setMonitoreoSubs([]);
    } finally {
      setMonitoreoLoading(false);
    }
  };

  const handleTogglePublish = async (exam) => {
    const next = !exam.published;
    setExams((prev) => prev.map((e) => e.id === exam.id ? { ...e, published: next } : e));
    try {
      await httpClient.patch(`/exams/${exam.id}/publish`, { published: next });
    } catch {
      // revertir si falla
      setExams((prev) => prev.map((e) => e.id === exam.id ? { ...e, published: !next } : e));
    }
  };

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
            Exámenes
          </Typography>
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: '0.9rem',
              mt: 0.5,
            }}
          >
            Todos los exámenes de tus cursos
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCrearExamen}
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
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#001f56' }} />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {!loading && !error && exams.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6, color: '#6b7280' }}>
            <Typography sx={{ fontSize: '0.95rem', mb: 2 }}>
              Todavía no tenés exámenes creados.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrearExamen}
              sx={{
                backgroundColor: '#001f56',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { backgroundColor: '#00153d' },
              }}
            >
              Crear examen
            </Button>
          </Box>
        )}

        {!loading && !error && exams.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  Examen
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  Curso
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow
                  key={exam.id}
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: '#f9f9f9' },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: '#001f56',
                      fontSize: '0.875rem',
                    }}
                  >
                    {exam.title || exam.nombre || '(sin título)'}
                  </TableCell>
                  <TableCell sx={{ color: '#666', fontSize: '0.875rem' }}>
                    {exam.subjectName || exam.subjectId || exam.curso || '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Tooltip title={exam.published ? 'Click para despublicar' : 'Click para publicar'}>
                        <Switch
                          checked={!!exam.published}
                          onChange={() => handleTogglePublish(exam)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#001f56' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#001f56' },
                          }}
                        />
                      </Tooltip>
                      {(() => {
                        const { label, color, bg } = STATUS_CONFIG[getExamStatus(exam)];
                        return (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: bg, color, borderRadius: 1.5, px: 1.5, py: 0.3 }}>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{label}</Typography>
                          </Box>
                        );
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => navigate(`/docente/examenes/${exam.id}/editar`)}
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: 'transparent', color: '#001f56' },
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => navigate(`/docente/examenes/${exam.id}/acceso`)}
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: 'transparent', color: '#001f56' },
                        }}
                      >
                        Turno
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<PeopleIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => handleMonitoreoClick(exam)}
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: 'transparent', color: '#001f56' },
                        }}
                      >
                        Monitoreo
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/docente/correcciones/${exam.id}`)}
                        sx={{
                          backgroundColor: '#001f56',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          borderRadius: 1.5,
                          px: 2,
                          '&:hover': { backgroundColor: '#001845' },
                        }}
                      >
                        Corregí
                      </Button>
                      <Tooltip title="Eliminar examen">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteTarget(exam)}
                          sx={{ color: '#999', '&:hover': { color: '#d32f2f' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Box>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#001f56' }}>Eliminar examen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que querés eliminar <strong>{deleteTarget?.title}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ bgcolor: '#d32f2f', textTransform: 'none', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Monitoreo Dialog */}
      <Dialog
        open={!!monitoreoExam}
        onClose={() => setMonitoreoExam(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <Box sx={{ bgcolor: '#001f56', px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PeopleIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1, mb: 0.3 }}>Monitoreo de entregas</Typography>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', lineHeight: 1.2 }}>
              {monitoreoExam?.title}
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {monitoreoLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 2 }}>
              <CircularProgress sx={{ color: '#001f56' }} size={36} />
              <Typography sx={{ color: '#888', fontSize: '0.88rem' }}>Cargando entregas...</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {[
                  { value: monitoreoSubs.length, label: 'Entregados', color: '#001f56', bg: '#eef2ff' },
                  { value: monitoreoSubs.filter((s) => s.status === 'SUBMITTED').length, label: 'Pendientes', color: '#e65100', bg: '#fff8e1' },
                  { value: monitoreoSubs.filter((s) => s.status === 'GRADED').length, label: 'Corregidos', color: '#2e7d32', bg: '#e8f5e9' },
                ].map(({ value, label, color, bg }) => (
                  <Box key={label} sx={{ flex: 1, bgcolor: bg, borderRadius: 2.5, py: 2, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 0.5, fontWeight: 500 }}>{label}</Typography>
                  </Box>
                ))}
              </Box>

              {monitoreoSubs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: '#999' }}>
                  <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <PeopleIcon sx={{ fontSize: 32, color: '#ccc' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>Sin entregas por el momento</Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#aaa' }}>Ningún alumno ha entregado este examen todavía.</Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e8e8e8', borderRadius: 2, overflow: 'hidden' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7f8fc' }}>
                        {['Legajo', 'Alumno', 'Entregado', 'Estado', 'Nota'].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 700, color: '#444', fontSize: '0.78rem', py: 1.5, letterSpacing: '0.02em' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monitoreoSubs.map((sub, idx) => (
                        <TableRow
                          key={sub.id}
                          sx={{
                            bgcolor: idx % 2 === 0 ? '#fff' : '#fafbff',
                            '&:last-child td': { borderBottom: 0 },
                            transition: 'background 0.15s',
                            '&:hover': { bgcolor: '#f0f4ff' },
                          }}
                        >
                          <TableCell sx={{ fontSize: '0.82rem', color: '#666', py: 1.5, fontFamily: 'monospace' }}>{sub.studentLegajo || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', py: 1.5 }}>{sub.studentName || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.8rem', color: '#777', py: 1.5 }}>
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            {sub.status === 'GRADED' ? (
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: 1, px: 1, py: 0.25 }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 13 }} />
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Corregido</Typography>
                              </Box>
                            ) : (
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#fff8e1', color: '#e65100', borderRadius: 1, px: 1, py: 0.25 }}>
                                <HourglassEmptyIcon sx={{ fontSize: 13 }} />
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Pendiente</Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.82rem', py: 1.5 }}>
                            {sub.status === 'GRADED'
                              ? <Typography sx={{ fontWeight: 700, color: '#001f56', fontSize: '0.85rem' }}>{sub.totalScore} / {sub.totalPoints}</Typography>
                              : <Typography sx={{ color: '#ccc', fontSize: '0.85rem' }}>—</Typography>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f0f0f0', gap: 1 }}>
          <Button
            onClick={() => setMonitoreoExam(null)}
            sx={{ textTransform: 'none', color: '#555', fontWeight: 500, borderRadius: 2, px: 2 }}
          >
            Cerrar
          </Button>
          {monitoreoSubs.some((s) => s.status === 'SUBMITTED') && (
            <Button
              variant="contained"
              onClick={() => { setMonitoreoExam(null); navigate(`/docente/correcciones/${monitoreoExam.id}`); }}
              sx={{ textTransform: 'none', bgcolor: '#001f56', fontWeight: 600, borderRadius: 2, px: 2.5, '&:hover': { bgcolor: '#001845' } }}
            >
              Ir a corregir
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
