import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExamAPI from '../../../../../infrastructure/api/ExamAPI';
import SubmissionService from '../../../../../application/services/SubmissionService';

// ─── helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  MULTIPLE_CHOICE: 'Opción múltiple',
  MULTIPLE_SELECTION: 'Selección múltiple',
  TRUE_FALSE: 'Verdadero / Falso',
  LONG_ANSWER: 'Respuesta larga',
  SHORT_ANSWER: 'Respuesta corta',
  FILL_IN_THE_BLANK: 'Completar el espacio',
  ORDERING: 'Ordenar',
  MATCHING: 'Relacionar',
  DECISION_TREE: 'Árbol de decisión',
  MATRIX: 'Matriz',
};

const QuestionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  text: PropTypes.string,
  points: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string),
  topic: PropTypes.string,
  topicColor: PropTypes.string,
  matchingPairs: PropTypes.objectOf(PropTypes.string),
});

const AnswerShape = PropTypes.shape({
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.number),
  textAnswer: PropTypes.string,
  orderAnswer: PropTypes.arrayOf(PropTypes.string),
  matchingAnswer: PropTypes.objectOf(PropTypes.string),
});

const GroupShape = PropTypes.shape({
  topic: PropTypes.string,
  color: PropTypes.string,
  questions: PropTypes.arrayOf(QuestionShape),
});

const emptyAnswer = (question) => {
  const base = { questionId: question.id };
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE':
    case 'MULTIPLE_SELECTION':
      return { ...base, selectedOptions: [] };
    case 'LONG_ANSWER':
    case 'SHORT_ANSWER':
    case 'FILL_IN_THE_BLANK':
      return { ...base, textAnswer: '' };
    case 'ORDERING':
    case 'DECISION_TREE': {
      const src = question.correctOrder?.length ? question.correctOrder : (question.options ?? []);
      return { ...base, orderAnswer: [...src].sort(() => Math.random() - 0.5) };
    }
    case 'MATCHING':
    case 'MATRIX':
      return { ...base, matchingAnswer: {} };
    default:
      return base;
  }
};

const isAnswered = (a) => {
  if (a?.selectedOptions !== undefined) return a.selectedOptions.length > 0;
  if (a?.textAnswer !== undefined) return a.textAnswer.trim().length > 0;
  if (a?.orderAnswer !== undefined) return a.orderAnswer.length > 0;
  if (a?.matchingAnswer !== undefined) return Object.keys(a.matchingAnswer).length > 0;
  return false;
};

// ─── Componentes de respuesta ─────────────────────────────────────────────────

const MultipleChoiceAnswer = ({ question, answer, onChange }) => (
  <RadioGroup
    value={answer.selectedOptions?.[0] ?? ''}
    onChange={(e) => onChange({ ...answer, selectedOptions: [Number(e.target.value)] })}
  >
    {question.options?.map((opt, idx) => (
      <FormControlLabel
        key={idx}
        value={idx}
        control={<Radio sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }} />}
        label={opt}
        sx={{ mb: 0.5 }}
      />
    ))}
  </RadioGroup>
);

const TrueFalseAnswer = ({ answer, onChange }) => (
  <RadioGroup
    value={answer.selectedOptions?.[0] ?? ''}
    onChange={(e) => onChange({ ...answer, selectedOptions: [Number(e.target.value)] })}
    row
  >
    <FormControlLabel value={0} control={<Radio sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }} />} label="Verdadero" />
    <FormControlLabel value={1} control={<Radio sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }} />} label="Falso" />
  </RadioGroup>
);

const MultipleSelectionAnswer = ({ question, answer, onChange }) => {
  const selected = answer.selectedOptions ?? [];
  const toggle = (idx) => {
    const next = selected.includes(idx) ? selected.filter((i) => i !== idx) : [...selected, idx];
    onChange({ ...answer, selectedOptions: next });
  };
  return (
    <Box>
      {question.options?.map((opt, idx) => (
        <FormControlLabel
          key={idx}
          control={<Checkbox checked={selected.includes(idx)} onChange={() => toggle(idx)} sx={{ color: '#001f56', '&.Mui-checked': { color: '#001f56' } }} />}
          label={opt}
          sx={{ display: 'flex', mb: 0.5 }}
        />
      ))}
    </Box>
  );
};

const TextAnswer = ({ answer, onChange, multiline = false }) => (
  <TextField
    fullWidth multiline={multiline} minRows={multiline ? 4 : 1} maxRows={multiline ? 10 : 1}
    placeholder={multiline ? 'Escribí tu respuesta...' : 'Respuesta'}
    value={answer.textAnswer ?? ''}
    onChange={(e) => onChange({ ...answer, textAnswer: e.target.value })}
    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#001f56' } } }}
  />
);

const OrderingAnswer = ({ answer, onChange }) => {
  const items = answer.orderAnswer ?? [];
  const move = (idx, dir) => {
    const next = [...items];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    onChange({ ...answer, orderAnswer: next });
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((item, idx) => (
        <Paper key={idx} variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderRadius: 1, bgcolor: '#fafafa' }}>
          <Typography sx={{ mr: 1.5, color: '#999', fontWeight: 600, minWidth: 24, fontSize: '0.85rem' }}>{idx + 1}.</Typography>
          <Typography sx={{ flex: 1, fontSize: '0.9rem' }}>{item}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Mover arriba"><span>
              <IconButton size="small" onClick={() => move(idx, -1)} disabled={idx === 0}><ArrowUpwardIcon fontSize="small" /></IconButton>
            </span></Tooltip>
            <Tooltip title="Mover abajo"><span>
              <IconButton size="small" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}><ArrowDownwardIcon fontSize="small" /></IconButton>
            </span></Tooltip>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const MatchingAnswer = ({ question, answer, onChange }) => {
  const pairs = question.matchingPairs ?? {};
  const keys = Object.keys(pairs);
  const values = Object.values(pairs);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {keys.map((key) => (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ flex: 1, fontSize: '0.9rem', color: '#333' }}>{key}</Typography>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar</InputLabel>
              <Select
                value={answer.matchingAnswer?.[key] ?? ''}
                label="Seleccionar"
                onChange={(e) => onChange({ ...answer, matchingAnswer: { ...answer.matchingAnswer, [key]: e.target.value } })}
              >
                {values.map((val) => <MenuItem key={val} value={val}>{val}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// ─── Card de pregunta ─────────────────────────────────────────────────────────

const QuestionCard = ({ question, index, answer, onChange, topicColor }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE': return <MultipleChoiceAnswer question={question} answer={answer} onChange={onChange} />;
      case 'TRUE_FALSE': return <TrueFalseAnswer answer={answer} onChange={onChange} />;
      case 'MULTIPLE_SELECTION': return <MultipleSelectionAnswer question={question} answer={answer} onChange={onChange} />;
      case 'LONG_ANSWER': return <TextAnswer answer={answer} onChange={onChange} multiline />;
      case 'SHORT_ANSWER':
      case 'FILL_IN_THE_BLANK': return <TextAnswer answer={answer} onChange={onChange} />;
      case 'ORDERING':
      case 'DECISION_TREE': return <OrderingAnswer answer={answer} onChange={onChange} />;
      case 'MATCHING':
      case 'MATRIX': return <MatchingAnswer question={question} answer={answer} onChange={onChange} />;
      default: return <Typography color="text.secondary">Tipo no soportado: {question.type}</Typography>;
    }
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderLeft: `4px solid ${topicColor}`, borderRadius: 2, p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, color: '#666', mb: 0.5, fontSize: '0.8rem' }}>
            Pregunta {index + 1} · {TYPE_LABELS[question.type] ?? question.type}
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: '#222', lineHeight: 1.5 }}>{question.text}</Typography>
        </Box>
        <Chip label={`${question.points ?? 0} pts`} size="small" sx={{ ml: 2, bgcolor: '#e8eaf6', color: '#3949ab', fontWeight: 600, flexShrink: 0 }} />
      </Box>
      {renderInput()}
    </Paper>
  );
};

// ─── Vista: selección de temas ────────────────────────────────────────────────

const TopicSelectionView = ({ exam, groups, answers, onSelectTopic }) => {
  const totalQuestions = groups.reduce((s, g) => s + g.questions.length, 0);
  const totalAnswered = groups.reduce((s, g) => s + g.questions.filter((q) => isAnswered(answers[q.id])).length, 0);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ p: 4, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>{exam.title}</Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
          {exam.subjectName || exam.subjectId}
          {exam.durationMinutes ? ` · ${exam.durationMinutes} min` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
          Progreso: {totalAnswered}/{totalQuestions} preguntas respondidas.
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Elegí el tema que te asignó el profesor. Solo podés entregar uno.
        </Typography>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        <Grid container spacing={2.5}>
          {groups.map((group, idx) => {
            const topicAnswered = group.questions.filter((q) => isAnswered(answers[q.id])).length;
            const topicTotal = group.questions.length;
            const allDone = topicAnswered === topicTotal;
            const color = group.color || '#001f56';
            const colSize = Math.max(3, Math.floor(12 / groups.length));

            return (
              <Grid size={{ xs: 12, sm: colSize }} key={group.topic}>
                <Paper
                  elevation={0}
                  onClick={() => onSelectTopic(idx)}
                  sx={{
                    borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' },
                  }}
                >
                  {/* Header coloreado */}
                  <Box sx={{ bgcolor: color, px: 3, py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tema {idx + 1}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', mt: 0.25, lineHeight: 1.3 }}>
                        {group.topic}
                      </Typography>
                    </Box>
                    {allDone && <CheckCircleIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 28, mt: 0.25 }} />}
                  </Box>

                  {/* Progreso */}
                  <Box sx={{ px: 3, py: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={topicTotal > 0 ? (topicAnswered / topicTotal) * 100 : 0}
                      sx={{
                        height: 6, borderRadius: 3, bgcolor: '#e0e0e0', mb: 0.75,
                        '& .MuiLinearProgress-bar': { bgcolor: allDone ? '#2e7d32' : color, borderRadius: 3 },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      {topicAnswered}/{topicTotal} respondidas
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

// ─── Vista: preguntas de un tema ──────────────────────────────────────────────

const TopicQuestionsView = ({ group, topicIdx, answers, onAnswerChange, onBack, onFinish }) => {
  const color = group.color || '#001f56';
  const answered = group.questions.filter((q) => isAnswered(answers[q.id])).length;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header coloreado */}
      <Box sx={{ bgcolor: color, px: 4, py: 3, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Tooltip title="Cambiar tema">
            <IconButton onClick={onBack} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tema {topicIdx + 1}
            </Typography>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
              {group.topic}
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
            {answered}/{group.questions.length} respondidas
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={group.questions.length > 0 ? (answered / group.questions.length) * 100 : 0}
          sx={{
            height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.25)',
            '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 2 },
          }}
        />
      </Box>

      {/* Preguntas */}
      <Box sx={{ px: 4, py: 3, maxWidth: 900, width: '100%', mx: 'auto' }}>
        {group.questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            answer={answers[q.id] ?? emptyAnswer(q)}
            onChange={(newAnswer) => onAnswerChange(q.id, newAnswer)}
            topicColor={color}
          />
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ textTransform: 'none', borderColor: '#001f56', color: '#001f56' }}
          >
            Cambiar tema
          </Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={onFinish}
            sx={{ bgcolor: color, color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}
          >
            Revisar y entregar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

MultipleChoiceAnswer.propTypes = {
  question: QuestionShape.isRequired,
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
};

TrueFalseAnswer.propTypes = {
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
};

MultipleSelectionAnswer.propTypes = {
  question: QuestionShape.isRequired,
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
};

TextAnswer.propTypes = {
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool,
};

OrderingAnswer.propTypes = {
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
};

MatchingAnswer.propTypes = {
  question: QuestionShape.isRequired,
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
};

QuestionCard.propTypes = {
  question: QuestionShape.isRequired,
  index: PropTypes.number.isRequired,
  answer: AnswerShape.isRequired,
  onChange: PropTypes.func.isRequired,
  topicColor: PropTypes.string,
};

TopicSelectionView.propTypes = {
  exam: PropTypes.shape({
    title: PropTypes.string,
    subjectName: PropTypes.string,
    subjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    durationMinutes: PropTypes.number,
  }).isRequired,
  groups: PropTypes.arrayOf(GroupShape).isRequired,
  answers: PropTypes.object.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};

TopicQuestionsView.propTypes = {
  group: GroupShape.isRequired,
  topicIdx: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

// ─── Componente principal ─────────────────────────────────────────────────────

const RealizarExamenContent = ({ examId }) => {
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [groups, setGroups] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 'topics' | 'questions'
  const [view, setView] = useState('topics');
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, mySubmissions] = await Promise.all([
          ExamAPI.getExamById(examId),
          SubmissionService.getMySubmissions().catch(() => []),
        ]);
        if (!mounted) return;

        const already = (Array.isArray(mySubmissions) ? mySubmissions : []).some((s) => s.examId === examId);
        if (already) { setAlreadySubmitted(true); setLoading(false); return; }

        setExam(data);

        const qs = [...(data.questions ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const seen = new Map();
        qs.forEach((q) => {
          const topic = q.topic || 'Sin tema';
          if (!seen.has(topic)) seen.set(topic, { topic, color: q.topicColor || '#001f56', questions: [] });
          seen.get(topic).questions.push(q);
        });
        setGroups([...seen.values()]);

        const initial = {};
        qs.forEach((q) => { initial[q.id] = emptyAnswer(q); });
        setAnswers(initial);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar el examen');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [examId]);

  const handleAnswerChange = useCallback((questionId, newAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: newAnswer }));
  }, []);

  const handleSelectTopic = (idx) => { setSelectedTopicIdx(idx); setView('questions'); };
  const handleBackToTopics = () => setView('topics');

  const selectedGroup = groups[selectedTopicIdx];
  const topicAnswered = selectedGroup ? selectedGroup.questions.filter((q) => isAnswered(answers[q.id])).length : 0;
  const topicTotal = selectedGroup ? selectedGroup.questions.length : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersList = (selectedGroup?.questions ?? []).map((q) => answers[q.id] ?? emptyAnswer(q));
      await SubmissionService.submitExam(examId, answersList);
      setConfirmOpen(false);
      setSnackbar({ open: true, message: '¡Examen entregado exitosamente!', severity: 'success' });
      setTimeout(() => navigate('/alumno'), 1800);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Error al entregar el examen', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#001f56' }} />
      </Box>
    );
  }

  if (alreadySubmitted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2, p: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: '#2e7d32' }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#001f56' }}>Ya entregaste este examen</Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>No podés volver a realizarlo.</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/alumno/resultados')}
          sx={{ mt: 1, bgcolor: '#001f56', textTransform: 'none', '&:hover': { bgcolor: '#003080' } }}
        >
          Ver mis resultados
        </Button>
        <Button variant="text" onClick={() => navigate('/alumno')} sx={{ textTransform: 'none', color: '#666' }}>
          Volver a exámenes
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/alumno')}>Volver</Button>
      </Box>
    );
  }

  return (
    <>
      {view === 'topics' && (
        <TopicSelectionView
          exam={exam}
          groups={groups}
          answers={answers}
          onSelectTopic={handleSelectTopic}
        />
      )}

      {view === 'questions' && selectedGroup && (
        <TopicQuestionsView
          group={selectedGroup}
          topicIdx={selectedTopicIdx}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onBack={handleBackToTopics}
          onFinish={() => setConfirmOpen(true)}
        />
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#001f56' }}>Confirmar entrega</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Respondiste {topicAnswered} de {topicTotal} pregunta{topicTotal === 1 ? '' : 's'} del tema seleccionado.
            {topicAnswered < topicTotal && ` Hay ${topicTotal - topicAnswered} sin responder.`} ¿Querés entregar el examen?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>Volver</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: '#001f56', textTransform: 'none', '&:hover': { bgcolor: '#003080' } }}
          >
            {submitting ? 'Entregando...' : 'Entregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RealizarExamenContent;
