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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const exams = [
  {
    id: 1,
    name: 'Parcial 1',
    course: 'Testing - Manana',
    status: 'Publicado',
    statusColor: '#059669',
    statusBg: '#d1fae5',
    pending: 12,
  },
  {
    id: 2,
    name: 'Recuperatorio',
    course: 'Testing - Tarde',
    status: 'Borrador',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    pending: 0,
  },
  {
    id: 3,
    name: 'Parcial 2',
    course: 'Testing - Noche',
    status: 'Activo',
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    pending: 0,
  },
];

const RecentExams = () => {
  const navigate = useNavigate();

  const goToCorrecciones = () => navigate('/docente/correcciones');

  return (
    <Box>
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
        Exámenes Recientes
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  Examen
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  Curso
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  Pendientes
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    fontSize: '0.85rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                  align="right"
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow
                  key={exam.id}
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: '#f9fafb' },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#111827',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {exam.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {exam.course}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Chip
                      label={exam.status}
                      size="small"
                      sx={{
                        backgroundColor: exam.statusBg,
                        color: exam.statusColor,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 26,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#111827',
                      fontSize: '0.9rem',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: exam.pending > 0 ? 'pointer' : 'default',
                      '&:hover': exam.pending > 0 ? { color: '#001f56' } : undefined,
                    }}
                    onClick={() => exam.pending > 0 && goToCorrecciones()}
                  >
                    {exam.pending}
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Button
                      variant="text"
                      onClick={goToCorrecciones}
                      sx={{
                        color: '#001f56',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        '&:hover': {
                          backgroundColor: 'rgba(0,31,86,0.04)',
                        },
                      }}
                    >
                      Abrir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RecentExams;
