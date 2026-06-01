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

const TOPIC_COLORS = [
  '#1565c0', '#2e7d32', '#6a1b9a', '#c62828',
  '#e65100', '#00838f', '#4527a0', '#558b2f',
];

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
      
      case 'tabla': {
        const pares = question.pares || [{ izquierda: '', derecha: '' }];

        const handleUpdatePar = (idx, side, value) => {
          const next = pares.map((p, i) => i === idx ? { ...p, [side]: value } : p);
          onUpdate({ ...question, pares: next });
        };
        const handleAddPar = () => onUpdate({ ...question, pares: [...pares, { izquierda: '', derecha: '' }] });
        const handleRemovePar = (idx) => {
          if (pares.length > 1) onUpdate({ ...question, pares: pares.filter((_, i) => i !== idx) });
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
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, color: '#555', px: 1 }}>Columna izquierda</Typography>
              <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, color: '#555', px: 1 }}>Columna derecha (respuesta correcta)</Typography>
              <Box sx={{ width: 32 }} />
            </Box>
            {pares.map((par, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder={`Elemento ${idx + 1}`}
                  value={par.izquierda}
                  onChange={(e) => handleUpdatePar(idx, 'izquierda', e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder={`Corresponde a...`}
                  value={par.derecha}
                  onChange={(e) => handleUpdatePar(idx, 'derecha', e.target.value)}
                />
                <IconButton size="small" onClick={() => handleRemovePar(idx)} disabled={pares.length === 1} sx={{ color: '#999', '&:hover': { color: '#d32f2f' } }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddPar} sx={{ textTransform: 'none', color: '#001f56', mt: 0.5 }}>
              Agregar par
            </Button>
            <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
              El alumno relacionará cada elemento de la izquierda con su correspondiente de la derecha.
            </Typography>
          </Box>
        );
      }
      
      case 'arbol-decision': {
        const items = question.items || ['', ''];
        const handleUpdateItem = (idx, value) => {
          const next = items.map((it, i) => i === idx ? value : it);
          onUpdate({ ...question, items: next });
        };
        const handleAddItem = () => onUpdate({ ...question, items: [...items, ''] });
        const handleRemoveItem = (idx) => {
          if (items.length > 2) onUpdate({ ...question, items: items.filter((_, i) => i !== idx) });
        };
        return (
          <Box>
            <TextField fullWidth multiline rows={2} placeholder="Enunciado de la pregunta..." value={question.enunciado || ''} onChange={handleEnunciadoChange} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Typography variant="caption" sx={{ color: '#555', fontWeight: 600, mb: 1, display: 'block' }}>
              Ítems en el orden correcto (el alumno deberá reordenarlos)
            </Typography>
            {items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Typography sx={{ color: '#999', fontWeight: 600, minWidth: 24, fontSize: '0.85rem' }}>{idx + 1}.</Typography>
                <TextField size="small" fullWidth placeholder={`Ítem ${idx + 1}`} value={item} onChange={(e) => handleUpdateItem(idx, e.target.value)} />
                <IconButton size="small" onClick={() => handleRemoveItem(idx)} disabled={items.length === 2} sx={{ color: '#999', '&:hover': { color: '#d32f2f' } }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddItem} sx={{ textTransform: 'none', color: '#001f56', mt: 0.5 }}>
              Agregar ítem
            </Button>
            <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
              El alumno recibirá los ítems en orden aleatorio y deberá reordenarlos correctamente.
            </Typography>
          </Box>
        );
      }
      
      case 'multiple-choice': {
        const opciones = question.opciones || ['', '', '', ''];
        const correcta = question.correcta ?? null;

        const handleAddOption = () => {
          onUpdate({ ...question, opciones: [...opciones, ''] });
        };

        const handleRemoveOption = (optIndex) => {
          if (opciones.length > 2) {
            const newOpciones = opciones.filter((_, i) => i !== optIndex);
            const newCorrecta = correcta === optIndex ? null : correcta > optIndex ? correcta - 1 : correcta;
            onUpdate({ ...question, opciones: newOpciones, correcta: newCorrecta });
          }
        };

        const handleUpdateOption = (optIndex, value) => {
          const newOpciones = [...opciones];
          newOpciones[optIndex] = value;
          onUpdate({ ...question, opciones: newOpciones });
        };

        const handleSetCorrecta = (optIndex) => {
          onUpdate({ ...question, correcta: correcta === optIndex ? null : optIndex });
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
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {opciones.map((opcion, i) => {
                const isCorrect = correcta === i;
                return (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      onClick={() => handleSetCorrecta(i)}
                      title={isCorrect ? 'Desmarcar como correcta' : 'Marcar como correcta'}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: isCorrect ? '2px solid #2e7d32' : '2px solid #bbb',
                        bgcolor: isCorrect ? '#2e7d32' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isCorrect ? '#fff' : '#888',
                        flexShrink: 0,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': {
                          borderColor: '#2e7d32',
                          bgcolor: isCorrect ? '#1b5e20' : 'rgba(46,125,50,0.08)',
                          color: isCorrect ? '#fff' : '#2e7d32',
                        },
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
                          borderColor: isCorrect ? '#2e7d32' : undefined,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isCorrect ? '#a5d6a7 !important' : undefined,
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
                );
              })}
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddOption}
              sx={{ textTransform: 'none', color: '#001f56', mt: 1.5 }}
            >
              Agregar opción
            </Button>
            <Typography variant="caption" sx={{ color: correcta === null ? '#e65100' : '#2e7d32', mt: 1, display: 'block', fontWeight: correcta === null ? 500 : 400 }}>
              {correcta === null
                ? 'Hacé clic en la letra de una opción para marcarla como correcta.'
                : `Opción ${String.fromCharCode(65 + correcta)} marcada como correcta.`}
            </Typography>
          </Box>
        );
      }
      
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
  const [temas, setTemas] = useState([{ id: 1, nombre: 'Tema 1', color: TOPIC_COLORS[0], preguntas: [] }]);
  const [examId, setExamId] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const showMessage = (severity, message) => setSnackbar({ open: true, severity, message });

  // Mapea los tipos de pregunta de la UI a los enums que espera el backend
  const QUESTION_TYPE_MAP = {
    'texto-libre': 'LONG_ANSWER',
    'tabla': 'MATRIX',
    'arbol-decision': 'DECISION_TREE',
    'multiple-choice': 'MULTIPLE_CHOICE',
  };

  const buildMatchingPairs = (pares) =>
    Object.fromEntries((pares || []).filter((p) => p.izquierda).map((p) => [p.izquierda, p.derecha || '']));

  const buildQuestionPayload = (tema, q) => {
    const base = {
      type: QUESTION_TYPE_MAP[q.type] || 'LONG_ANSWER',
      text: q.enunciado || '',
      points: q.puntaje || 0,
      topic: tema.nombre,
      topicColor: tema.color || TOPIC_COLORS[0],
    };

    if (q.type === 'multiple-choice' && q.opciones) {
      base.options = q.opciones;
      if (q.correcta != null) {
        base.correctAnswers = [q.correcta];
      }
    }
    if (q.type === 'arbol-decision' && q.items) {
      base.correctOrder = q.items.filter(Boolean);
    }
    if (q.type === 'tabla' && q.pares) {
      base.matchingPairs = buildMatchingPairs(q.pares);
    }

    return base;
  };

  // Mapea el estado UI al payload que espera el backend (campos en inglés)
  const buildExamPayload = (status) => {
    const questions = temas.flatMap((tema) => tema.preguntas.map((q) => buildQuestionPayload(tema, q)));
    const totalPoints = temas.length * 10;

    return {
      title: formData.nombre,
      subjectId: formData.curso ? String(formData.curso) : '',
      shift: formData.turno ? String(formData.turno) : '',
      period: formData.periodo,
      totalPoints,
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

    const temasInvalidos = temas.filter(
      (t) => t.preguntas.reduce((s, q) => s + (q.puntaje || 0), 0) !== 10
    );
    if (temasInvalidos.length > 0) {
      const nombres = temasInvalidos.map((t) => t.nombre).join(', ');
      showMessage('error', `El puntaje de ${nombres} debe sumar exactamente 10`);
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
    const color = TOPIC_COLORS[(temas.length) % TOPIC_COLORS.length];
    setTemas([...temas, { id: newId, nombre: `Tema ${newId}`, color, preguntas: [] }]);
    setSelectedTab(temas.length);
  };

  const handleUpdateTemaColor = (color) => {
    setTemas((prev) => prev.map((t, i) => i === selectedTab ? { ...t, color } : t));
  };

  const handleSelectQuestionType = (typeId) => {
    const newQuestion = {
      id: Date.now(),
      type: typeId,
      enunciado: '',
      puntaje: 1,
      ...(typeId === 'multiple-choice' && { opciones: ['', '', '', ''], correcta: null }),
      ...(typeId === 'arbol-decision' && { items: ['', ''] }),
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

  const currentTema = temas[selectedTab];
  const currentTemaPts = currentTema?.preguntas.reduce((s, q) => s + (q.puntaje || 0), 0) ?? 0;

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

          {/* Puntaje por tema */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                Puntaje — {currentTema?.nombre}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: currentTemaPts > 10 ? '#d32f2f' : currentTemaPts === 10 ? '#2e7d32' : '#001f56' }}>
                {currentTemaPts} / 10 puntos
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((currentTemaPts / 10) * 100, 100)}
              sx={{
                height: 8, borderRadius: 4, bgcolor: '#e0e0e0', mb: 1.5,
                '& .MuiLinearProgress-bar': {
                  bgcolor: currentTemaPts > 10 ? '#d32f2f' : currentTemaPts === 10 ? '#2e7d32' : (currentTema?.color || '#001f56'),
                  borderRadius: 4,
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {temas.map((tema) => {
                const pts = tema.preguntas.reduce((s, q) => s + (q.puntaje || 0), 0);
                return (
                  <Chip
                    key={tema.id}
                    label={`${tema.nombre}: ${pts}/10 pts`}
                    size="small"
                    sx={{ bgcolor: pts === 10 ? tema.color || TOPIC_COLORS[0] : '#e0e0e0', color: pts === 10 ? '#fff' : '#555', fontWeight: 600, fontSize: '0.75rem' }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Temas Tabs */}
          <Box sx={{ px: 3, pt: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pb: 1.5 }}>
              {temas.map((tema, index) => {
                const active = selectedTab === index;
                return (
                  <Box
                    key={tema.id}
                    onClick={() => setSelectedTab(index)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.75,
                      px: 2, py: 1, borderRadius: 2, cursor: 'pointer',
                      bgcolor: active ? (tema.color || '#001f56') : 'transparent',
                      color: active ? '#fff' : '#333',
                      fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.2s',
                      border: active ? 'none' : `2px solid ${tema.color || '#001f56'}`,
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: active ? 'rgba(255,255,255,0.7)' : (tema.color || '#001f56'), flexShrink: 0 }} />
                    <span>{tema.nombre} ({tema.preguntas.length})</span>
                    {temas.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteTema(tema.id, e)}
                        sx={{ p: 0.25, ml: 0.25, color: active ? 'rgba(255,255,255,0.7)' : '#666', '&:hover': { color: active ? '#fff' : '#d32f2f', bgcolor: 'transparent' } }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
              <Button
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={handleAddTema}
                sx={{ textTransform: 'none', color: '#001f56', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0, 31, 86, 0.08)' } }}
              >
                Agregar tema
              </Button>
            </Box>
            {/* Color picker para el tema activo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#666', flexShrink: 0 }}>Color del tema:</Typography>
              {TOPIC_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => handleUpdateTemaColor(c)}
                  sx={{
                    width: 20, height: 20, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                    border: (currentTema?.color || TOPIC_COLORS[0]) === c ? '3px solid #333' : '2px solid transparent',
                    boxShadow: (currentTema?.color || TOPIC_COLORS[0]) === c ? '0 0 0 1px #fff inset' : 'none',
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.25)' },
                  }}
                />
              ))}
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

            {/* Question Type Selector — siempre visible */}
            <Paper
              elevation={0}
              sx={{ border: '1px dashed #ccc', borderRadius: 2, p: 3, mt: currentTema?.preguntas.length > 0 ? 2 : 0 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#555', mb: 2 }}>
                Agregar pregunta
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {questionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Paper
                      key={type.id}
                      onClick={() => handleSelectQuestionType(type.id)}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#001f56', bgcolor: 'rgba(0, 31, 86, 0.02)' },
                      }}
                    >
                      <Icon sx={{ fontSize: 26, color: '#001f56', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 0.25 }}>
                        {type.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {type.description}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
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
