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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const mockExams = [
  {
    id: 1,
    nombre: 'Parcial 1',
    curso: 'Testing - Mañana',
    estado: 'Publicado',
  },
  {
    id: 2,
    nombre: 'Recuperatorio',
    curso: 'Testing - Tarde',
    estado: 'Borrador',
  },
  {
    id: 3,
    nombre: 'Parcial 2',
    curso: 'Testing - Noche',
    estado: 'Activo',
  },
];

const getEstadoChip = (estado) => {
  const estilos = {
    Publicado: {
      backgroundColor: '#fff',
      color: '#001f56',
      border: '1px solid #001f56',
    },
    Borrador: {
      backgroundColor: '#fff',
      color: '#001f56',
      border: '1px solid #001f56',
    },
    Activo: {
      backgroundColor: '#fff',
      color: '#001f56',
      border: '1px solid #001f56',
    },
  };

  return (
    <Chip
      label={estado}
      size="small"
      sx={{
        ...estilos[estado],
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 26,
      }}
    />
  );
};

export default function ExamenesContent() {
  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#001f56',
              mb: 0.5,
            }}
          >
            Exámenes
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#666' }}
          >
            Todos los exámenes de tus cursos
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#001f56',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#001845',
            },
          }}
        >
          Crear examen
        </Button>
      </Box>

      {/* Tabla de exámenes */}
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
            {mockExams.map((exam) => (
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
                  {exam.nombre}
                </TableCell>
                <TableCell sx={{ color: '#666', fontSize: '0.875rem' }}>
                  {exam.curso}
                </TableCell>
                <TableCell>{getEstadoChip(exam.estado)}</TableCell>
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
                      Corregir
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
