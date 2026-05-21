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
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState } from 'react';

const mockAlumnos = [
  {
    id: 1,
    alumno: 'García, Sofía',
    inicio: '09:00',
    envio: '10:10',
    tActivo: '65 min',
    salidas: 0,
    tFuera: '0s',
    autoguardados: 12,
    tipoEnvio: 'automático',
    porcResp: '100%',
    nota: 6,
  },
  {
    id: 2,
    alumno: 'Pérez, Mateo',
    inicio: '09:01',
    envio: '10:11',
    tActivo: '67 min',
    salidas: 1,
    tFuera: '30s',
    autoguardados: 13,
    tipoEnvio: 'manual',
    porcResp: '90%',
    nota: 7,
  },
  {
    id: 3,
    alumno: 'Rodriguez, Camila',
    inicio: '09:02',
    envio: '10:12',
    tActivo: '69 min',
    salidas: 2,
    tFuera: '60s',
    autoguardados: 14,
    tipoEnvio: 'manual',
    porcResp: '80%',
    nota: 8,
  },
  {
    id: 4,
    alumno: 'Fernández, Lucas',
    inicio: '09:03',
    envio: '10:13',
    tActivo: '71 min',
    salidas: 3,
    tFuera: '90s',
    autoguardados: 15,
    tipoEnvio: 'manual',
    porcResp: '70%',
    nota: 9,
  },
  {
    id: 5,
    alumno: 'Gómez, Valentina',
    inicio: '09:04',
    envio: '10:14',
    tActivo: '73 min',
    salidas: 0,
    tFuera: '0s',
    autoguardados: 16,
    tipoEnvio: 'manual',
    porcResp: '100%',
    nota: 10,
  },
  {
    id: 6,
    alumno: 'Martínez, Tomás',
    inicio: '09:05',
    envio: '10:15',
    tActivo: '75 min',
    salidas: 1,
    tFuera: '30s',
    autoguardados: 17,
    tipoEnvio: 'automático',
    porcResp: '90%',
    nota: 6,
  },
];

const gradeDistribution = [
  { grade: 0, count: 0 },
  { grade: 1, count: 0 },
  { grade: 2, count: 2 },
  { grade: 3, count: 3 },
  { grade: 4, count: 5 },
  { grade: 5, count: 7 },
  { grade: 6, count: 6 },
  { grade: 7, count: 4 },
  { grade: 8, count: 2 },
  { grade: 9, count: 2 },
  { grade: 10, count: 1 },
];

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
      }}
    >
      <Icon sx={{ color: iconColor, fontSize: 24 }} />
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: '#666',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontSize: '0.7rem',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#001f56',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Paper>
);

const MetricasContent = () => {
  const [selectedExam, setSelectedExam] = useState('Testing de Aplicaciones');
  const [selectedTurno, setSelectedTurno] = useState('Mañana');
  const [selectedAlumnos, setSelectedAlumnos] = useState('Todos los alumnos');

  const maxCount = Math.max(...gradeDistribution.map((g) => g.count));

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
            Métricas
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
            }}
          >
            Análisis de desempeño y comportamiento por examen.
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4, flex: 1 }}>
        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            mb: 3,
            display: 'flex',
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ flex: 1 }}>
            <Select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              sx={{
                bgcolor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <MenuItem value="Testing de Aplicaciones">Testing de Aplicaciones</MenuItem>
              <MenuItem value="Parcial 1">Parcial 1</MenuItem>
              <MenuItem value="Parcial 2">Parcial 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flex: 1 }}>
            <Select
              value={selectedTurno}
              onChange={(e) => setSelectedTurno(e.target.value)}
              sx={{
                bgcolor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <MenuItem value="Mañana">Mañana</MenuItem>
              <MenuItem value="Tarde">Tarde</MenuItem>
              <MenuItem value="Noche">Noche</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flex: 1 }}>
            <Select
              value={selectedAlumnos}
              onChange={(e) => setSelectedAlumnos(e.target.value)}
              sx={{
                bgcolor: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <MenuItem value="Todos los alumnos">Todos los alumnos</MenuItem>
              <MenuItem value="Aprobados">Aprobados</MenuItem>
              <MenuItem value="Desaprobados">Desaprobados</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            icon={PeopleOutlineIcon}
            label="ALUMNOS"
            value="32"
            bgColor="#e3f2fd"
            iconColor="#1976d2"
          />
          <StatCard
            icon={CheckCircleOutlineIcon}
            label="COMPLETADOS"
            value="84%"
            bgColor="#e8f5e9"
            iconColor="#2e7d32"
          />
          <StatCard
            icon={WarningAmberIcon}
            label="ENTREGAS PARCIALES"
            value="6%"
            bgColor="#fff3e0"
            iconColor="#f57c00"
          />
          <StatCard
            icon={ChatBubbleOutlineIcon}
            label="PROMEDIO"
            value="7.4"
            bgColor="#e3f2fd"
            iconColor="#1976d2"
          />
        </Box>

        {/* Charts Row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 2,
            mb: 3,
          }}
        >
          {/* Grade Distribution Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: '#333', mb: 3 }}
            >
              Distribución de notas
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120 }}>
              {gradeDistribution.map((item) => (
                <Box
                  key={item.grade}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: maxCount > 0 ? (item.count / maxCount) * 80 : 0,
                      minHeight: item.count > 0 ? 8 : 0,
                      bgcolor: '#001f56',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: '#666', fontSize: '0.75rem' }}
                  >
                    {item.grade}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Atypical Behaviors */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: '#333', mb: 2 }}
            >
              Comportamientos atípicos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#f44336',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#333' }}>
                  {'3 alumnos con > 5 salidas de pantalla'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#ff9800',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#333' }}>
                  2 entregas automáticas por tiempo
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#ff9800',
                  }}
                />
                <Typography variant="body2" sx={{ color: '#333' }}>
                  {'1 alumno con < 30% respondido'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Students Table */}
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
                {['Alumno', 'Inicio', 'Envío', 'T. activo', 'Salidas', 'T. fuera', 'Autoguardados', 'Tipo envío', '% Resp.', 'Nota'].map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        color: '#666',
                        borderBottom: '1px solid #e0e0e0',
                        py: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAlumnos.map((alumno) => (
                <TableRow
                  key={alumno.id}
                  sx={{
                    '&:hover': {
                      bgcolor: '#fafafa',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.alumno}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.inicio}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.envio}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.tActivo}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: alumno.salidas >= 3 ? '#f44336' : '#666',
                      fontWeight: alumno.salidas >= 3 ? 600 : 400,
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.salidas}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.tFuera}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.autoguardados}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    <Chip
                      label={alumno.tipoEnvio}
                      size="small"
                      sx={{
                        bgcolor:
                          alumno.tipoEnvio === 'automático' ? '#ffebee' : '#e3f2fd',
                        color:
                          alumno.tipoEnvio === 'automático' ? '#c62828' : '#1565c0',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#666',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.porcResp}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      borderBottom: '1px solid #f0f0f0',
                      py: 2,
                    }}
                  >
                    {alumno.nota}
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

export default MetricasContent;
