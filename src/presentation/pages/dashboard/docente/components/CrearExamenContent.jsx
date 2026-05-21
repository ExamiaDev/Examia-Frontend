import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const steps = ['Crear examen', 'Cargar respuestas', 'Generar acceso'];

const cursos = [
  { id: 1, nombre: 'Testing de Aplicaciones - Mañana' },
  { id: 2, nombre: 'Testing de Aplicaciones - Tarde' },
  { id: 3, nombre: 'Testing de Aplicaciones - Noche' },
];

const turnos = [
  { id: 1, nombre: 'Mañana' },
  { id: 2, nombre: 'Tarde' },
  { id: 3, nombre: 'Noche' },
];

export default function CrearExamenContent() {
  const [activeStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    curso: '',
    turno: '',
    periodo: '2026 - 1°c',
  });
  const [temas, setTemas] = useState([{ id: 1, nombre: 'Tema 1', preguntas: 0 }]);

  const handleDeleteTema = (temaId, event) => {
    event.stopPropagation();
    if (temas.length > 1) {
      const newTemas = temas.filter(t => t.id !== temaId);
      // Renumerar los temas
      const renumberedTemas = newTemas.map((tema, index) => ({
        ...tema,
        id: index + 1,
        nombre: `Tema ${index + 1}`,
      }));
      setTemas(renumberedTemas);
      // Ajustar el tab seleccionado si es necesario
      if (selectedTab >= renumberedTemas.length) {
        setSelectedTab(renumberedTemas.length - 1);
      }
    }
  };

  const handleAddTema = () => {
    const newId = temas.length + 1;
    setTemas([...temas, { id: newId, nombre: `Tema ${newId}`, preguntas: 0 }]);
    setSelectedTab(temas.length);
  };

  const puntajeTotal = 0;
  const puntajeMax = 10;

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
            Crear examen
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#666' }}
          >
            Diseña las preguntas y asigná puntajes.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            sx={{
              borderColor: '#001f56',
              color: '#001f56',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                borderColor: '#001f56',
                bgcolor: 'rgba(0, 31, 86, 0.04)',
              },
            }}
          >
            Guardar borrador
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#001f56',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                bgcolor: '#002a75',
              },
            }}
          >
            Continuar
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4, flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          {/* Stepper */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': {
                          color: '#001f56',
                        },
                        '&.Mui-completed': {
                          color: '#001f56',
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: index === activeStep ? '#001f56' : '#666',
                        fontWeight: index === activeStep ? 600 : 400,
                        fontSize: '0.875rem',
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form Fields */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: '#333' }}
                >
                  Nombre del examen
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Parcial 1"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: '#333' }}
                >
                  Curso
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.curso}
                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccioná</em>
                    </MenuItem>
                    {cursos.map((curso) => (
                      <MenuItem key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: '#333' }}
                >
                  Turno
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.turno}
                    onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccioná</em>
                    </MenuItem>
                    {turnos.map((turno) => (
                      <MenuItem key={turno.id} value={turno.id}>
                        {turno.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: '#333' }}
                >
                  Período
                </Typography>
                <TextField
                  fullWidth
                  value={formData.periodo}
                  disabled
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#f5f5f5',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Puntaje Total */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: '#333' }}
              >
                Puntaje total
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#001f56' }}
              >
                {puntajeTotal} / {puntajeMax} puntos
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(puntajeTotal / puntajeMax) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#001f56',
                  borderRadius: 4,
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" sx={{ color: '#666' }}>
                La sumatoria debe ser exactamente 10 para continuar.
              </Typography>
            </Box>
          </Box>

          {/* Temas Tabs */}
          <Box sx={{ px: 3, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {temas.map((tema, index) => (
                <Box
                  key={tema.id}
                  onClick={() => setSelectedTab(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: selectedTab === index ? '#001f56' : 'transparent',
                    color: selectedTab === index ? '#fff' : '#333',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: selectedTab === index ? '#001f56' : 'rgba(0, 31, 86, 0.08)',
                    },
                  }}
                >
                  <span>{tema.nombre} ({tema.preguntas})</span>
                  {temas.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteTema(tema.id, e)}
                      sx={{
                        p: 0.25,
                        ml: 0.5,
                        color: selectedTab === index ? 'rgba(255,255,255,0.7)' : '#666',
                        '&:hover': {
                          color: selectedTab === index ? '#fff' : '#001f56',
                          bgcolor: 'transparent',
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={handleAddTema}
                sx={{
                  textTransform: 'none',
                  color: '#001f56',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(0, 31, 86, 0.08)',
                  },
                }}
              >
                Agregar tema
              </Button>
            </Box>
          </Box>

          {/* Agregar Pregunta */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#001f56',
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#002a75',
                },
              }}
            >
              Agregar pregunta
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
