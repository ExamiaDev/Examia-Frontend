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
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExamService from '../../../../../application/services/ExamService';

// Mapea el status del backend a la etiqueta que mostramos
const STATUS_LABELS = {
  borrador: 'Borrador',
  BORRADOR: 'Borrador',
  DRAFT: 'Borrador',
  publicado: 'Publicado',
  PUBLICADO: 'Publicado',
  PUBLISHED: 'Publicado',
  activo: 'Activo',
  ACTIVO: 'Activo',
  ACTIVE: 'Activo',
  finalizado: 'Finalizado',
  FINALIZADO: 'Finalizado',
  FINISHED: 'Finalizado',
};

const getEstadoChip = (status) => {
  const label = STATUS_LABELS[status] || status || '—';
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: '#fff',
        color: '#001f56',
        border: '1px solid #001f56',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 26,
      }}
    />
  );
};

export default function ExamenesContent() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <Typography sx={{ fontSize: '0.95rem' }}>
              Todavía no tenés exámenes creados. Hacé click en <strong>Crear examen</strong> para empezar.
            </Typography>
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
                  <TableCell>{getEstadoChip(exam.status || exam.estado)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#001f56',
                          },
                        }}
                      >
                        Turno
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: '#666',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#001f56',
                          },
                        }}
                      >
                        Monitoreo
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#001f56',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          borderRadius: 1.5,
                          px: 2,
                          '&:hover': {
                            backgroundColor: '#001845',
                          },
                        }}
                      >
                        Corregí
                      </Button>
                    </Box>
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
