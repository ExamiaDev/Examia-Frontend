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
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SubmissionService from '../../../../../application/services/SubmissionService';

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const StatusChip = ({ status, score, totalPoints }) => {
  if (status === 'GRADED') {
    const label = totalPoints != null
      ? `${score ?? '?'} / ${totalPoints} pts`
      : `${score ?? '?'} pts`;
    return (
      <Chip
        label={label}
        size="small"
        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }}
      />
    );
  }
  return (
    <Chip
      label="Pendiente de corrección"
      size="small"
      sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 500, fontSize: '0.75rem' }}
    />
  );
};

const MisResultadosContent = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SubmissionService.getMySubmissions();
        if (mounted) setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar tus resultados');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const gradedCount = submissions.filter((s) => s.status === 'GRADED').length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
            Mis Resultados
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {loading
              ? 'Cargando...'
              : submissions.length === 0
              ? 'Aún no realizaste ningún examen.'
              : `${gradedCount} corregido${gradedCount !== 1 ? 's' : ''} · ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}`}
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

        {!loading && !error && submissions.length === 0 && (
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', p: 6, textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aún no realizaste ningún examen
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Completá un examen y tus resultados aparecerán acá.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#001f56', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: '#003080' } }}
              onClick={() => navigate('/alumno')}
            >
              Ver exámenes disponibles
            </Button>
          </Paper>
        )}

        {!loading && !error && submissions.length > 0 && (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['Examen', 'Entregado', 'Estado', ''].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', py: 2 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ fontWeight: 500, color: '#001f56', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {sub.examTitle || '(sin título)'}
                    </TableCell>
                    <TableCell sx={{ color: '#555', borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {formatDate(sub.submittedAt)}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      <StatusChip status={sub.status} score={sub.totalScore} totalPoints={sub.totalPoints} />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid #f0f0f0', py: 2.5 }}>
                      {sub.status === 'GRADED' ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/alumno/resultados/${sub.id}`)}
                          sx={{
                            bgcolor: '#001f56', color: '#fff', textTransform: 'none',
                            fontWeight: 500, px: 2.5, py: 0.75, borderRadius: 1,
                            '&:hover': { bgcolor: '#003080' },
                          }}
                        >
                          Ver corrección
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic', textAlign: 'right' }}>
                          En espera
                        </Typography>
                      )}
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
};

export default MisResultadosContent;
