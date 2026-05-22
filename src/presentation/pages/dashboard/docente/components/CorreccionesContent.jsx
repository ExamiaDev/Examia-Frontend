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
} from '@mui/material';

const mockCorrecciones = [
  {
    id: 1,
    legajo: '1098765',
    alumno: 'Sofía García',
    examen: 'Parcial 1',
    entregado: 'Hoy 10:14',
    entregaParcial: false,
  },
  {
    id: 2,
    legajo: '1098768',
    alumno: 'Lucas Fernández',
    examen: 'Parcial 1',
    entregado: 'Hoy 10:21',
    entregaParcial: true,
  },
  {
    id: 3,
    legajo: '1098770',
    alumno: 'Tomás Martínez',
    examen: 'Parcial 1',
    entregado: 'Hoy 09:58',
    entregaParcial: false,
  },
];

const CorreccionesContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f7fa',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 4,
          pb: 2,
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
            Correcciones pendientes
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
            }}
          >
            Entregas que esperan tu revisión.
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4, flex: 1 }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                  }}
                >
                  Legajo
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                  }}
                >
                  Alumno
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                  }}
                >
                  Examen
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#666',
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                  }}
                >
                  Entregado
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    py: 2,
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {mockCorrecciones.map((correccion) => (
                <TableRow
                  key={correccion.id}
                  sx={{
                    '&:hover': {
                      bgcolor: '#fafafa',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2.5,
                    }}
                  >
                    {correccion.legajo}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #f0f0f0',
                      py: 2.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: '#001f56',
                        }}
                      >
                        {correccion.alumno}
                      </Typography>
                      {correccion.entregaParcial && (
                        <Chip
                          label="Entrega Parcial"
                          size="small"
                          sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2.5,
                    }}
                  >
                    {correccion.examen}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2.5,
                    }}
                  >
                    {correccion.entregado}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: '1px solid #f0f0f0',
                      py: 2.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#001f56',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 2.5,
                        py: 0.75,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: '#003080',
                        },
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
      </Box>
    </Box>
  );
};

export default CorreccionesContent;
