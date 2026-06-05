import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import GradeIcon from '@mui/icons-material/Grade';
import ExamAPI from '../../../../../infrastructure/api/ExamAPI';
import SubmissionService from '../../../../../application/services/SubmissionService';

const SHIFT_LABEL = { '1': 'Mañana', '2': 'Tarde', '3': 'Noche' };

const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 2,
      border: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        bgcolor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color: iconColor, fontSize: 24 }} />
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#001f56' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const MetricasContent = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [filterAlumnos, setFilterAlumnos] = useState('todos');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await ExamAPI.getExams();
        setExams(data);
        if (data.length > 0) {
          setSelectedExamId(data[0].id);
          setSelectedExam(data[0]);
        }
      } catch (e) {
        console.error('Error cargando exámenes:', e);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    if (!selectedExamId) return;
    const fetchSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
        const data = await SubmissionService.getSubmissions(selectedExamId);
        setSubmissions(data);
      } catch (e) {
        console.error('Error cargando entregas:', e);
        setSubmissions([]);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    fetchSubmissions();
  }, [selectedExamId]);

  const handleExamChange = (examId) => {
    setSelectedExamId(examId);
    setSelectedExam(exams.find((e) => e.id === examId) ?? null);
    setFilterAlumnos('todos');
  };

  const passingGrade = useMemo(() => {
    if (selectedExam?.passingScore && selectedExam?.totalPoints) {
      return (selectedExam.passingScore / selectedExam.totalPoints) * 10;
    }
    return 6;
  }, [selectedExam]);

  const toGrade = (s) => {
    if (s.status !== 'GRADED' || s.totalScore == null || !s.totalPoints) return null;
    return Math.round((s.totalScore / s.totalPoints) * 100) / 10;
  };

  const gradedSubmissions = useMemo(
    () => submissions.filter((s) => toGrade(s) !== null),
    [submissions]
  );

  const filteredSubmissions = useMemo(() => {
    if (filterAlumnos === 'aprobados') return submissions.filter((s) => { const g = toGrade(s); return g !== null && g >= passingGrade; });
    if (filterAlumnos === 'desaprobados') return submissions.filter((s) => { const g = toGrade(s); return g !== null && g < passingGrade; });
    return submissions;
  }, [submissions, filterAlumnos, passingGrade]);

  const totalEntregas = submissions.length;
  const totalCalificados = gradedSubmissions.length;
  const totalPendientes = submissions.filter((s) => s.status === 'SUBMITTED').length;
  const promedio =
    gradedSubmissions.length > 0
      ? (
          gradedSubmissions.reduce((acc, s) => acc + toGrade(s), 0) / gradedSubmissions.length
        ).toFixed(1)
      : '-';

  const gradeDistribution = useMemo(() => {
    const dist = Array.from({ length: 11 }, (_, i) => ({ grade: i, count: 0 }));
    gradedSubmissions.forEach((s) => {
      const g = Math.min(10, Math.max(0, Math.round(toGrade(s))));
      dist[g].count++;
    });
    return dist;
  }, [gradedSubmissions]);

  const maxCount = Math.max(...gradeDistribution.map((g) => g.count), 1);

  const desaprobados = gradedSubmissions.filter((s) => toGrade(s) < passingGrade);
  const notaMuyBaja = gradedSubmissions.filter((s) => toGrade(s) < 4);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
      ' ' +
      d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    );
  };

  if (loadingExams) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#001f56' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
            Métricas
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Análisis de desempeño por examen.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4, flex: 1 }}>
        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', mb: 3, display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ flex: 2 }}>
            <InputLabel>Examen</InputLabel>
            <Select
              value={selectedExamId}
              label="Examen"
              onChange={(e) => handleExamChange(e.target.value)}
              sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}
            >
              {exams.length === 0 && (
                <MenuItem disabled value="">Sin exámenes</MenuItem>
              )}
              {exams.map((exam) => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.title}
                  {exam.shift ? ` — ${SHIFT_LABEL[exam.shift] ?? exam.shift}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Alumnos</InputLabel>
            <Select
              value={filterAlumnos}
              label="Alumnos"
              onChange={(e) => setFilterAlumnos(e.target.value)}
              sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}
            >
              <MenuItem value="todos">Todos los alumnos</MenuItem>
              <MenuItem value="aprobados">Aprobados</MenuItem>
              <MenuItem value="desaprobados">Desaprobados</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {(() => {
          if (exams.length === 0) {
            return (
              <Paper elevation={0} sx={{ p: 6, borderRadius: 2, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  No tenés exámenes creados todavía.
                </Typography>
              </Paper>
            );
          }
          if (loadingSubmissions) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#001f56' }} />
              </Box>
            );
          }
          return (
          <>
            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
              <StatCard icon={GroupsIcon} label="Entregas" value={totalEntregas} bgColor="#e3f2fd" iconColor="#1976d2" />
              <StatCard icon={CheckCircleIcon} label="Calificados" value={totalCalificados} bgColor="#e8f5e9" iconColor="#2e7d32" />
              <StatCard icon={WarningIcon} label="Sin calificar" value={totalPendientes} bgColor="#fff3e0" iconColor="#f57c00" />
              <StatCard icon={GradeIcon} label="Promedio" value={promedio} bgColor="#e3f2fd" iconColor="#1976d2" />
            </Box>

            {/* Charts Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 3 }}>
              {/* Grade Distribution */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
                  Distribución de notas
                </Typography>
                {gradedSubmissions.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Sin entregas calificadas aún
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120 }}>
                    {gradeDistribution.map((item) => (
                      <Box key={item.grade} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#001f56', fontWeight: 600, fontSize: '0.65rem', mb: 0.5, opacity: item.count > 0 ? 1 : 0 }}>
                          {item.count > 0 ? item.count : ''}
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            height: (item.count / maxCount) * 80,
                            minHeight: item.count > 0 ? 8 : 0,
                            bgcolor: item.grade >= passingGrade ? '#001f56' : '#e57373',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                          {item.grade}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              {/* Indicators */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                  Indicadores
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {totalEntregas === 0 && (
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Sin entregas registradas
                    </Typography>
                  )}
                  {totalPendientes > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: '#333' }}>
                        {totalPendientes} entrega{totalPendientes > 1 ? 's' : ''} pendiente{totalPendientes > 1 ? 's' : ''} de calificar
                      </Typography>
                    </Box>
                  )}
                  {desaprobados.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: '#333' }}>
                        {desaprobados.length} alumno{desaprobados.length > 1 ? 's' : ''} desaprobado{desaprobados.length > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  )}
                  {notaMuyBaja.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: '#333' }}>
                        {notaMuyBaja.length} alumno{notaMuyBaja.length > 1 ? 's' : ''} con nota menor a 4
                      </Typography>
                    </Box>
                  )}
                  {totalEntregas > 0 && totalPendientes === 0 && desaprobados.length === 0 && notaMuyBaja.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#4caf50' }}>
                      ✓ Sin indicadores de alerta
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Students Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Alumno', 'Legajo', 'Fecha de envío', 'Estado', 'Puntos', 'Nota (0–10)'].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2, whiteSpace: 'nowrap' }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 5, color: '#999' }}>
                        {submissions.length === 0
                          ? 'No hay entregas para este examen'
                          : 'No hay alumnos que coincidan con el filtro'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((s) => {
                      const grade = toGrade(s);
                      const isGraded = s.status === 'GRADED';
                      let gradeColor = '#999';
                      if (grade !== null) {
                        gradeColor = grade >= passingGrade ? '#2e7d32' : '#f44336';
                      }
                      return (
                        <TableRow key={s.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                          <TableCell sx={{ fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                            {s.studentName}
                          </TableCell>
                          <TableCell sx={{ color: '#666', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                            {s.studentLegajo || '-'}
                          </TableCell>
                          <TableCell sx={{ color: '#666', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                            {formatDate(s.submittedAt)}
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                            <Chip
                              label={isGraded ? 'Calificado' : 'Pendiente'}
                              size="small"
                              sx={{
                                bgcolor: isGraded ? '#e8f5e9' : '#fff3e0',
                                color: isGraded ? '#2e7d32' : '#f57c00',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                height: 24,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#666', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                            {isGraded && s.totalScore != null
                              ? `${s.totalScore} / ${s.totalPoints}`
                              : '-'}
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, color: gradeColor, borderBottom: '1px solid #f0f0f0', py: 2 }}
                          >
                            {grade !== null ? grade : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
          );
        })()}
      </Box>
    </Box>
  );
};

export default MetricasContent;
