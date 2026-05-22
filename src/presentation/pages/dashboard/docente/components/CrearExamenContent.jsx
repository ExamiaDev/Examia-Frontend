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
  Collapse,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExamService from '../../../../../application/services/ExamService';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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

const questionTypes = [
  {
    id: 'texto-libre',
    title: 'Texto libre',
    description: 'Respuesta abierta',
    icon: DescriptionOutlinedIcon,
  },
  {
    id: 'tabla',
    title: 'Tabla',
    description: 'Matriz de casos',
    icon: TableChartOutlinedIcon,
  },
  {
    id: 'arbol-decision',
    title: 'Árbol de decisión',
    description: 'Diagrama lógico',
    icon: AccountTreeOutlinedIcon,
  },
  {
    id: 'multiple-choice',
    title: 'Múltiple choice',
    description: 'Opciones cerradas',
    icon: FormatListBulletedIcon,
  },
];

const puntajeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Question Card Component
function QuestionCard({ question, index, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  
  const typeLabel = questionTypes.find(t => t.id === question.type)?.title || question.type;
  
  const handleEnunciadoChange = (e) => {
    onUpdate({ ...question, enunciado: e.target.value });
  };
  
  const handlePuntajeChange = (e) => {
    onUpdate({ ...question, puntaje: e.target.value });
  };

  // Render content based on question type
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'texto-libre':
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enunciado de la pregunta..."
              value={question.enunciado || ''}
              onChange={handleEnunciadoChange}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#666' }}>
              El alumno responderá usando el editor de texto libre.
            </Typography>
          </Box>
        );
      
      case 'tabla':
        const columns = question.columnas || ['Columna 1', 'Columna 2', 'Columna 3'];
        const rows = question.filas || 3;
        
        const handleAddColumn = () => {
          const newColumns = [...columns, `Columna ${columns.length + 1}`];
          onUpdate({ ...question, columnas: newColumns });
        };
        
        const handleAddRow = () => {
          onUpdate({ ...question, filas: rows + 1 });
        };
        
        const handleUpdateColumn = (colIndex, value) => {
          const newColumns = [...columns];
          newColumns[colIndex] = value;
          onUpdate({ ...question, columnas: newColumns });
        };
        
        const handleRemoveColumn = (colIndex) => {
          if (columns.length > 2) {
            const newColumns = columns.filter((_, i) => i !== colIndex);
            onUpdate({ ...question, columnas: newColumns });
          }
        };
        
        const handleRemoveRow = () => {
          if (rows > 1) {
            onUpdate({ ...question, filas: rows - 1 });
          }
        };
        
return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Enunciado de la pregunta..."
              value={question.enunciado || ''}
              onChange={handleEnunciadoChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns.length}, 1fr) auto`,
                  bgcolor: '#f5f7fa',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                {columns.map((col, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 1.5,
                      borderRight: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Columna ${i + 1}`}
                      value={col}
                      onChange={(e) => handleUpdateColumn(i, e.target.value)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ '& input': { fontWeight: 500, fontSize: '0.875rem' } }}
                    />
                    {columns.length > 2 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveColumn(i)}
                        sx={{ p: 0.25, color: '#999', '&:hover': { color: '#d32f2f' } }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleAddColumn}
                    sx={{ color: '#001f56' }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <Box
                  key={rowIndex}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns.length}, 1fr) auto`,
                    borderBottom: rowIndex < rows - 1 ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  {columns.map((_, colIndex) => (
                    <Box
                      key={colIndex}
                      sx={{
                        p: 1.5,
                        borderRight: '1px solid #e0e0e0',
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="..."
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{ '& input': { fontSize: '0.875rem' } }}
                      />
                    </Box>
                  ))}
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    {rowIndex === rows - 1 && rows > 1 && (
                      <IconButton
                        size="small"
                        onClick={handleRemoveRow}
                        sx={{ p: 0.25, color: '#999', '&:hover': { color: '#d32f2f' } }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddRow}
                sx={{ textTransform: 'none', color: '#001f56' }}
              >
                Agregar fila
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
              El alumno completará la matriz de casos.
            </Typography>
          </Box>
        );
      
      case 'arbol-decision':
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Enunciado de la pregunta..."
              value={question.enunciado || ''}
              onChange={handleEnunciadoChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box
              sx={{
                border: '1px dashed #ccc',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                bgcolor: '#fafafa',
              }}
            >
              <AccountTreeOutlinedIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                Editor de árbol de decisión
              </Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>
                El alumno construirá un diagrama lógico
              </Typography>
            </Box>
          </Box>
        );
      
      case 'multiple-choice':
        const opciones = question.opciones || ['', '', '', ''];
        
        const handleAddOption = () => {
          const newOpciones = [...opciones, ''];
          onUpdate({ ...question, opciones: newOpciones });
        };
        
        const handleRemoveOption = (optIndex) => {
          if (opciones.length > 2) {
            const newOpciones = opciones.filter((_, i) => i !== optIndex);
            onUpdate({ ...question, opciones: newOpciones });
          }
        };
        
        const handleUpdateOption = (optIndex, value) => {
          const newOpciones = [...opciones];
          newOpciones[optIndex] = value;
          onUpdate({ ...question, opciones: newOpciones });
        };
        
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Enunciado de la pregunta..."
              value={question.enunciado || ''}
              onChange={handleEnunciadoChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {opciones.map((opcion, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '2px solid #001f56',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#001f56',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                    value={opcion}
                    onChange={(e) => handleUpdateOption(i, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  {opciones.length > 2 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveOption(i)}
                      sx={{ color: '#999', '&:hover': { color: '#d32f2f' } }}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddOption}
              sx={{ textTransform: 'none', color: '#001f56', mt: 1.5 }}
            >
              Agregar opción
            </Button>
            <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
              El alumno seleccionará una opción correcta.
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: '#fff',
          borderBottom: expanded ? '1px solid #e0e0e0' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#666' }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Chip
            label={`Pregunta ${index + 1}`}
            size="small"
            sx={{
              bgcolor: '#f0f4f8',
              color: '#333',
              fontWeight: 500,
              fontSize: '0.8rem',
            }}
          />
          <Chip
            label={typeLabel}
            size="small"
            sx={{
              bgcolor: '#001f56',
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Puntaje
            </Typography>
            <Select
              value={question.puntaje || 1}
              onChange={handlePuntajeChange}
              size="small"
              sx={{
                minWidth: 70,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: 2,
                },
              }}
            >
              {puntajeOptions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{ color: '#999', '&:hover': { color: '#d32f2f' } }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {renderQuestionContent()}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default function CrearExamenContent() {
  const navigate = useNavigate();
  const [activeStep] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    curso: '',
    turno: '',
    periodo: '2026 - 1°c',
  });
  const [temas, setTemas] = useState([{ id: 1, nombre: 'Tema 1', preguntas: [] }]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [examId, setExamId] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const showMessage = (severity, message) => setSnackbar({ open: true, severity, message });

  // Mapea los tipos de pregunta de la UI a los enums que espera el backend
  const QUESTION_TYPE_MAP = {
    'texto-libre': 'LONG_ANSWER',
    'tabla': 'MATCHING',
    'arbol-decision': 'ORDERING',
    'multiple-choice': 'MULTIPLE_CHOICE',
  };

  // Mapea el estado UI al payload que espera el backend (campos en inglés)
  const buildExamPayload = (status) => {
    const questions = temas.flatMap((tema) =>
      tema.preguntas.map((q) => ({
        type: QUESTION_TYPE_MAP[q.type] || 'LONG_ANSWER',
        text: q.enunciado || '',
        points: q.puntaje || 0,
        topic: tema.nombre,
        ...(q.opciones && { options: q.opciones }),
        ...(q.columnas && { columns: q.columnas }),
        ...(q.filas && { rows: q.filas }),
      }))
    );

    return {
      title: formData.nombre,
      subjectId: formData.curso ? String(formData.curso) : '',
      shift: formData.turno ? String(formData.turno) : '',
      period: formData.periodo,
      totalPoints: 10,
      questions,
      status,
    };
  };

  const validateRequiredFields = () => {
    if (!formData.nombre.trim()) {
      showMessage('error', 'El nombre del examen es obligatorio');
      return false;
    }
    if (!formData.curso) {
      showMessage('error', 'Tenés que seleccionar un curso');
      return false;
    }
    if (!formData.turno) {
      showMessage('error', 'Tenés que seleccionar un turno');
      return false;
    }
    return true;
  };

  const handleGuardarBorrador = async () => {
    if (!formData.nombre.trim()) {
      showMessage('error', 'Ingresá al menos un nombre para guardar el borrador');
      return;
    }
    setSavingDraft(true);
    try {
      const payload = buildExamPayload('borrador');
      // Para borrador permitimos puntaje incompleto: lo recalculamos al actual
      payload.totalPoints = payload.questions.reduce((sum, q) => sum + (q.points || 0), 0) || 10;
      console.log('[ExamRequest] Guardar borrador payload:', JSON.stringify(payload, null, 2));

      let result;
      if (examId) {
        result = await ExamService.updateExam(examId, payload);
      } else {
        result = await ExamService.createExam(payload);
        if (result?.id) setExamId(result.id);
      }
      showMessage('success', 'Borrador guardado correctamente');
    } catch (error) {
      showMessage('error', error.message || 'No se pudo guardar el borrador');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleContinuar = async () => {
    if (!validateRequiredFields()) return;

    const totalPreguntas = temas.reduce((acc, t) => acc + t.preguntas.length, 0);
    if (totalPreguntas === 0) {
      showMessage('error', 'Agregá al menos una pregunta antes de continuar');
      return;
    }

    const sumaPuntajes = temas.reduce(
      (acc, t) => acc + t.preguntas.reduce((s, q) => s + (q.puntaje || 0), 0),
      0
    );
    if (sumaPuntajes !== 10) {
      showMessage('error', `La suma de puntajes debe ser exactamente 10 (actual: ${sumaPuntajes})`);
      return;
    }

    setContinuing(true);
    try {
      const payload = buildExamPayload('borrador');
      console.log('[ExamRequest] Continuar payload:', JSON.stringify(payload, null, 2));
      let saved;
      if (examId) {
        saved = await ExamService.updateExam(examId, payload);
      } else {
        saved = await ExamService.createExam(payload);
        if (saved?.id) setExamId(saved.id);
      }
      showMessage('success', 'Examen guardado, pasando al siguiente paso...');
      const id = saved?.id || examId;
      setTimeout(() => {
        if (id) {
          navigate(`/docente/examenes/${id}/respuestas`);
        }
      }, 800);
    } catch (error) {
      showMessage('error', error.message || 'No se pudo continuar');
    } finally {
      setContinuing(false);
    }
  };

  const handleDeleteTema = (temaId, event) => {
    event.stopPropagation();
    if (temas.length > 1) {
      const newTemas = temas.filter(t => t.id !== temaId);
      const renumberedTemas = newTemas.map((tema, index) => ({
        ...tema,
        id: index + 1,
        nombre: `Tema ${index + 1}`,
      }));
      setTemas(renumberedTemas);
      if (selectedTab >= renumberedTemas.length) {
        setSelectedTab(renumberedTemas.length - 1);
      }
    }
  };

  const handleAddTema = () => {
    const newId = temas.length + 1;
    setTemas([...temas, { id: newId, nombre: `Tema ${newId}`, preguntas: [] }]);
    setSelectedTab(temas.length);
  };

  const handleOpenQuestionSelector = () => {
    setShowQuestionSelector(true);
  };

  const handleCloseQuestionSelector = () => {
    setShowQuestionSelector(false);
  };

  const handleSelectQuestionType = (typeId) => {
    const newQuestion = {
      id: Date.now(),
      type: typeId,
      enunciado: '',
      puntaje: 1,
      ...(typeId === 'multiple-choice' && { opciones: ['', '', '', ''] }),
    };
    
    const updatedTemas = temas.map((tema, index) => {
      if (index === selectedTab) {
        return {
          ...tema,
          preguntas: [...tema.preguntas, newQuestion],
        };
      }
      return tema;
    });
    
    setTemas(updatedTemas);
    // Keep the selector open to allow adding more questions
  };

  const handleUpdateQuestion = (questionId, updatedQuestion) => {
    const updatedTemas = temas.map((tema, index) => {
      if (index === selectedTab) {
        return {
          ...tema,
          preguntas: tema.preguntas.map(q => 
            q.id === questionId ? updatedQuestion : q
          ),
        };
      }
      return tema;
    });
    setTemas(updatedTemas);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedTemas = temas.map((tema, index) => {
      if (index === selectedTab) {
        return {
          ...tema,
          preguntas: tema.preguntas.filter(q => q.id !== questionId),
        };
      }
      return tema;
    });
    setTemas(updatedTemas);
  };

  // Calculate total points
  const puntajeTotal = temas.reduce((total, tema) => {
    return total + tema.preguntas.reduce((sum, q) => sum + (q.puntaje || 0), 0);
  }, 0);
  const puntajeMax = 10;

  const currentTema = temas[selectedTab];

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
            startIcon={savingDraft ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={handleGuardarBorrador}
            disabled={savingDraft || continuing}
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
            {savingDraft ? 'Guardando...' : 'Guardar borrador'}
          </Button>
          <Button
            variant="contained"
            endIcon={continuing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ArrowForwardIcon />}
            onClick={handleContinuar}
            disabled={savingDraft || continuing}
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
            {continuing ? 'Procesando...' : 'Continuar'}
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
              value={Math.min((puntajeTotal / puntajeMax) * 100, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: puntajeTotal > puntajeMax ? '#d32f2f' : '#001f56',
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
          <Box sx={{ px: 3, pt: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pb: 2 }}>
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
                  <span>{tema.nombre} ({tema.preguntas.length})</span>
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

          {/* Questions List */}
          <Box sx={{ p: 3 }}>
            {currentTema?.preguntas.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updated) => handleUpdateQuestion(question.id, updated)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))}

            {/* Question Type Selector */}
            {showQuestionSelector ? (
              <Paper
                elevation={0}
                sx={{
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: '#333' }}
                  >
                    Elegí el tipo de pregunta
                  </Typography>
                  <Button
                    onClick={handleCloseQuestionSelector}
                    sx={{
                      textTransform: 'none',
                      color: '#001f56',
                      fontWeight: 500,
                    }}
                  >
                    Cancelar
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2,
                  }}
                >
                  {questionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Paper
                        key={type.id}
                        onClick={() => handleSelectQuestionType(type.id)}
                        elevation={0}
                        sx={{
                          p: 3,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#001f56',
                            bgcolor: 'rgba(0, 31, 86, 0.02)',
                          },
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: '#001f56', mb: 1.5 }} />
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}
                        >
                          {type.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666', fontSize: '0.8rem' }}
                        >
                          {type.description}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: currentTema?.preguntas.length > 0 ? 4 : 8,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenQuestionSelector}
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
            )}
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
