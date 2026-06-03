import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Paper,
  LinearProgress,
  IconButton,
  Collapse,
  Chip,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useState, useCallback, useEffect, memo } from 'react';
import ExamService from '../../../../../application/services/ExamService';
import ExamWizardShell from './ExamWizardShell';
import {
  CURSOS as cursos,
  TURNOS as turnos,
  TOPIC_COLORS,
  PUNTAJE_OPTIONS as puntajeOptions,
  MAX_TEMAS,
  MAX_OPTIONS,
  buildExamPayload,
  validateExamMetadata,
  createEmptyQuestion,
  examToWizardState,
} from './examWizardUtils';
import { validateStepQuestions } from './examWizardValidation';

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

const QUESTION_HINTS = {
  'texto-libre': 'El alumno responderá con texto libre. Las respuestas se cargan en el paso 2.',
  'tabla': 'Configurarás la tabla de referencia en el paso 2. El alumno no la verá.',
  'arbol-decision': 'Armá el árbol de decisión en el paso 2. El árbol completo es la respuesta.',
  'multiple-choice': 'Configurarás las opciones y la respuesta correcta en el paso 2.',
};

// Question Card Component
const QuestionCard = memo(function QuestionCard({ question, index, onUpdate, onDelete, hasEnunciadoError = false }) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (hasEnunciadoError) setExpanded(true);
  }, [hasEnunciadoError]);

  const saveQuestion = (updated) => onUpdate(question.id, updated);
  
  const typeLabel = questionTypes.find(t => t.id === question.type)?.title || question.type;
  
  const handleEnunciadoChange = (e) => {
    saveQuestion({ ...question, enunciado: e.target.value });
  };
  
  const handlePuntajeChange = (e) => {
    saveQuestion({ ...question, puntaje: Number(e.target.value) });
  };

  // Enunciado + opciones (MC) en paso 1; respuestas correctas en paso 2
  const renderQuestionContent = () => {
    if (question.type === 'multiple-choice') {
      const opciones = question.opciones || ['', '', '', ''];

      const handleAddOption = () => {
        if (opciones.length >= MAX_OPTIONS) return;
        saveQuestion({ ...question, opciones: [...opciones, ''] });
      };

      const handleRemoveOption = (optIndex) => {
        if (opciones.length > 2) {
          saveQuestion({ ...question, opciones: opciones.filter((_, i) => i !== optIndex) });
        }
      };

      const handleUpdateOption = (optIndex, value) => {
        const next = [...opciones];
        next[optIndex] = value;
        saveQuestion({ ...question, opciones: next });
      };

      return (
        <Box>
          <Typography variant="caption" sx={{ color: '#555', fontWeight: 600, display: 'block', mb: 0.5 }}>
            Enunciado <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enunciado de la pregunta..."
            value={question.enunciado || ''}
            onChange={handleEnunciadoChange}
            error={hasEnunciadoError}
            helperText={hasEnunciadoError ? 'El enunciado es obligatorio' : ''}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1.5 }}>
            Opciones de respuesta
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {opciones.map((opcion, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '2px solid #bbb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#888',
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
          <Tooltip title={opciones.length >= MAX_OPTIONS ? `Límite de ${MAX_OPTIONS} opciones alcanzado` : ''} arrow>
            <span>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                disabled={opciones.length >= MAX_OPTIONS}
                sx={{ textTransform: 'none', color: '#001f56', mt: 1.5, '&.Mui-disabled': { color: '#bbb' } }}
              >
                Agregar opción
              </Button>
            </span>
          </Tooltip>
          <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
            {QUESTION_HINTS['multiple-choice']}
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="caption" sx={{ color: '#555', fontWeight: 600, display: 'block', mb: 0.5 }}>
          Enunciado <span style={{ color: '#d32f2f' }}>*</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Enunciado de la pregunta..."
          value={question.enunciado || ''}
          onChange={handleEnunciadoChange}
          error={hasEnunciadoError}
          helperText={hasEnunciadoError ? 'El enunciado es obligatorio' : ''}
          sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Typography variant="caption" sx={{ color: '#666' }}>
          {QUESTION_HINTS[question.type] || 'Configurá las respuestas en el paso 2.'}
        </Typography>
      </Box>
    );
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
            onClick={() => onDelete(question.id)}
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
});

const ExamQuestionsPanel = memo(function ExamQuestionsPanel({
  temas,
  selectedTab,
  onSelectTab,
  onAddTema,
  onDeleteTema,
  onUpdateTemaColor,
  onSelectQuestionType,
  onUpdateQuestion,
  onDeleteQuestion,
  temasLimitReached,
  invalidQuestionIds = new Set(),
}) {
  const currentTema = temas[selectedTab];
  const currentTemaPts = currentTema?.preguntas.reduce((s, q) => s + Number(q.puntaje || 0), 0) ?? 0;

  return (
    <>
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
            const pts = tema.preguntas.reduce((s, q) => s + Number(q.puntaje || 0), 0);
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
                onClick={() => onSelectTab(index)}
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
                    onClick={(e) => onDeleteTema(tema.id, e)}
                    sx={{ p: 0.25, ml: 0.25, color: active ? 'rgba(255,255,255,0.7)' : '#666', '&:hover': { color: active ? '#fff' : '#d32f2f', bgcolor: 'transparent' } }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
          <Tooltip title={temasLimitReached ? `Límite de ${MAX_TEMAS} temas alcanzado` : ''} arrow>
            <span>
              <Button
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={onAddTema}
                disabled={temasLimitReached}
                sx={{ textTransform: 'none', color: '#001f56', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0, 31, 86, 0.08)' }, '&.Mui-disabled': { color: '#bbb' } }}
              >
                Agregar tema
              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#666', flexShrink: 0 }}>Color del tema:</Typography>
          {TOPIC_COLORS.map((c) => (
            <Box
              key={c}
              onClick={() => onUpdateTemaColor(c)}
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
            onUpdate={onUpdateQuestion}
            onDelete={onDeleteQuestion}
            hasEnunciadoError={invalidQuestionIds.has(question.id)}
          />
        ))}

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
                  onClick={() => onSelectQuestionType(type.id)}
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
    </>
  );
});

export default function CrearExamenContent({ initialExamId = null }) {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    curso: '',
    turno: '',
    periodo: '2026 - 1°c',
  });
  const [temas, setTemas] = useState([{ id: 1, nombre: 'Tema 1', color: TOPIC_COLORS[0], preguntas: [] }]);
  const [examId, setExamId] = useState(null);
  const [invalidQuestionIds, setInvalidQuestionIds] = useState(new Set());
  const [loadingExam, setLoadingExam] = useState(!!initialExamId);
  const [savingDraft, setSavingDraft] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    if (!initialExamId) return;
    let mounted = true;
    const load = async () => {
      try {
        const exam = await ExamService.getExamById(initialExamId);
        if (!mounted) return;
        const { formData: fd, temas: tm } = examToWizardState(exam);
        setFormData(fd);
        setTemas(tm);
        setExamId(initialExamId);
        setSelectedTab(0);
      } catch {
        if (mounted) showMessage('error', 'No se pudo cargar el examen para editar');
      } finally {
        if (mounted) setLoadingExam(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [initialExamId]);

  const showMessage = (severity, message) => setSnackbar({ open: true, severity, message });

  const getEmptyEnunciadoIds = () => {
    const ids = new Set();
    temas.forEach((tema) => {
      tema.preguntas.forEach((q) => {
        if (!(q.enunciado || '').trim()) ids.add(q.id);
      });
    });
    return ids;
  };

  const validateDraft = () => {
    const metaError = validateExamMetadata(formData);
    if (metaError) {
      showMessage('error', metaError);
      return false;
    }
    const totalPreguntas = temas.reduce((acc, t) => acc + t.preguntas.length, 0);
    if (totalPreguntas === 0) {
      showMessage('error', 'Agregá al menos una pregunta antes de guardar');
      return false;
    }
    return true;
  };

  const persistExam = async () => {
    const payload = buildExamPayload(formData, temas, { includeAnswers: false });
    if (examId) {
      return ExamService.updateExam(String(examId), payload);
    }
    const created = await ExamService.createExam(payload);
    const newId = created?.id;
    if (newId) setExamId(newId);
    return created;
  };

  const handleGuardarBorrador = async () => {
    if (!validateDraft()) return;
    setSavingDraft(true);
    try {
      await persistExam();
      showMessage('success', 'Borrador guardado correctamente');
    } catch (error) {
      showMessage('error', error.message || 'No se pudo guardar el borrador');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleContinuar = async () => {
    const metaError = validateExamMetadata(formData);
    if (metaError) return showMessage('error', metaError);

    const questionsError = validateStepQuestions(temas);
    if (questionsError) {
      setInvalidQuestionIds(getEmptyEnunciadoIds());
      return showMessage('error', questionsError);
    }
    setInvalidQuestionIds(new Set());

    setContinuing(true);
    try {
      const saved = await persistExam();
      const id = saved?.id || examId;
      if (!id) {
        showMessage('error', 'No se obtuvo el ID del examen. Intentá de nuevo.');
        return;
      }
      showMessage('success', 'Examen guardado, pasando al siguiente paso...');
      navigate(`/docente/examenes/${id}/respuestas`);
    } catch (error) {
      showMessage('error', error.message || 'No se pudo continuar');
    } finally {
      setContinuing(false);
    }
  };

  const handleDeleteTema = useCallback((temaId, event) => {
    event.stopPropagation();
    setTemas((prev) => {
      if (prev.length <= 1) return prev;
      const newTemas = prev.filter((t) => t.id !== temaId);
      const renumberedTemas = newTemas.map((tema, index) => ({
        ...tema,
        id: index + 1,
        nombre: `Tema ${index + 1}`,
      }));
      setSelectedTab((tab) => (tab >= renumberedTemas.length ? renumberedTemas.length - 1 : tab));
      return renumberedTemas;
    });
  }, []);

  const handleAddTema = useCallback(() => {
    setTemas((prev) => {
      if (prev.length >= MAX_TEMAS) return prev;
      const newId = prev.length + 1;
      const color = TOPIC_COLORS[prev.length % TOPIC_COLORS.length];
      setSelectedTab(prev.length);
      return [...prev, { id: newId, nombre: `Tema ${newId}`, color, preguntas: [] }];
    });
  }, []);

  const handleUpdateTemaColor = useCallback((color) => {
    setTemas((prev) => prev.map((t, i) => (i === selectedTab ? { ...t, color } : t)));
  }, [selectedTab]);

  const handleSelectQuestionType = useCallback((typeId) => {
    const newQuestion = createEmptyQuestion(typeId);
    setTemas((prev) => prev.map((tema, index) => (
      index === selectedTab
        ? { ...tema, preguntas: [...tema.preguntas, newQuestion] }
        : tema
    )));
  }, [selectedTab]);

  const handleUpdateQuestion = useCallback((questionId, updatedQuestion) => {
    if ((updatedQuestion.enunciado || '').trim()) {
      setInvalidQuestionIds((prev) => {
        if (!prev.has(questionId)) return prev;
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    }
    setTemas((prev) => prev.map((tema, index) => (
      index === selectedTab
        ? {
            ...tema,
            preguntas: tema.preguntas.map((q) => (q.id === questionId ? updatedQuestion : q)),
          }
        : tema
    )));
  }, [selectedTab]);

  const handleDeleteQuestion = useCallback((questionId) => {
    setTemas((prev) => prev.map((tema, index) => (
      index === selectedTab
        ? { ...tema, preguntas: tema.preguntas.filter((q) => q.id !== questionId) }
        : tema
    )));
  }, [selectedTab]);

  const handleSelectTab = useCallback((index) => setSelectedTab(index), []);

  if (loadingExam) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#001f56' }} />
      </Box>
    );
  }

  return (
    <ExamWizardShell
      activeStep={0}
      title={initialExamId ? 'Editar examen' : 'Crear examen'}
      subtitle="Diseñá las preguntas y asigná puntajes. Las respuestas se configuran en el paso 2."
      onSaveDraft={handleGuardarBorrador}
      onContinue={handleContinuar}
      savingDraft={savingDraft}
      continuing={continuing}
      snackbar={snackbar}
      onCloseSnackbar={() => setSnackbar((s) => ({ ...s, open: false }))}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Nombre del examen
            </Typography>
            <TextField
              fullWidth
              placeholder="Parcial 1"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Curso
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.curso}
                onChange={(e) => setFormData((prev) => ({ ...prev, curso: e.target.value }))}
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Turno
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.turno}
                onChange={(e) => setFormData((prev) => ({ ...prev, turno: e.target.value }))}
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
              Período
            </Typography>
            <TextField
              fullWidth
              value={formData.periodo}
              disabled
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f5f5f5' } }}
            />
          </Box>
        </Box>
      </Box>

      <ExamQuestionsPanel
        temas={temas}
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
        onAddTema={handleAddTema}
        onDeleteTema={handleDeleteTema}
        onUpdateTemaColor={handleUpdateTemaColor}
        onSelectQuestionType={handleSelectQuestionType}
        onUpdateQuestion={handleUpdateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        temasLimitReached={temas.length >= MAX_TEMAS}
        invalidQuestionIds={invalidQuestionIds}
      />
    </ExamWizardShell>
  );
}
