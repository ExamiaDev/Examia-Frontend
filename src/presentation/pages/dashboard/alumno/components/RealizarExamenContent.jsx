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
  Badge,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TimerIcon from '@mui/icons-material/Timer';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import LockIcon from '@mui/icons-material/Lock';
import { useExamProctoring, clearSavedViolations, enterFullscreen } from '../../../../hooks/useExamProctoring';
import { useExamTimer } from '../../../../hooks/useExamTimer';
import ExamAPI from '../../../../../infrastructure/api/ExamAPI';
import SubmissionService from '../../../../../application/services/SubmissionService';
import { createDefaultMatrix, isMatrixComplete } from '../../../../components/matrixTableUtils';
import { isDecisionTreeContentComplete } from '../../../../components/decisionTreeUtils';
import DecisionTreeEditor from '../../../../components/DecisionTreeEditor';
import MatrixTableEditor from '../../../../components/MatrixTableEditor';

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
  decisionTree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  correctOrder: PropTypes.arrayOf(PropTypes.string),
});

const AnswerShape = PropTypes.shape({
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.number),
  textAnswer: PropTypes.string,
  orderAnswer: PropTypes.arrayOf(PropTypes.string),
  matchingAnswer: PropTypes.objectOf(PropTypes.string),
  decisionTree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  matrixColumns: PropTypes.arrayOf(PropTypes.string),
  matrixRows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
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
    case 'ORDERING': {
      const src = question.correctOrder?.length ? question.correctOrder : (question.options ?? []);
      return { ...base, orderAnswer: [...src].sort(() => Math.random() - 0.5) };
    }
    case 'DECISION_TREE':
      return { ...base, decisionTree: null };
    case 'MATRIX': {
      const matrix = createDefaultMatrix();
      return { ...base, matrixColumns: matrix.matrixColumns, matrixRows: matrix.matrixRows };
    }
    case 'MATCHING':
    default:
      return base;
  }
};

const isAnswered = (question, answer) => {
  if (!answer) return false;
  if (question?.type === 'DECISION_TREE') {
    return isDecisionTreeContentComplete(answer.decisionTree);
  }
  if (question?.type === 'MATRIX') {
    return isMatrixComplete(answer.matrixColumns, answer.matrixRows);
  }
  if (answer.selectedOptions !== undefined) return answer.selectedOptions.length > 0;
  if (answer.textAnswer !== undefined) return answer.textAnswer.trim().length > 0;
  if (answer.orderAnswer !== undefined) return answer.orderAnswer.length > 0;
  if (answer.matchingAnswer !== undefined) return Object.keys(answer.matchingAnswer).length > 0;
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
        return <OrderingAnswer answer={answer} onChange={onChange} />;
      case 'DECISION_TREE':
        return (
          <Box>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1.5 }}>
              Armá tu árbol de decisión: agregá nodos con los botones, arrastrá para conectarlos y editá los textos haciendo doble clic.
            </Typography>
            <DecisionTreeEditor
              initialData={answer.decisionTree}
              onChange={(treeJson) => onChange({ ...answer, decisionTree: treeJson })}
            />
          </Box>
        );
      case 'MATRIX':
        return (
          <Box>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1.5 }}>
              Completá tu tabla. Podés agregar filas y columnas según necesites.
            </Typography>
            <MatrixTableEditor
              matrixColumns={answer.matrixColumns ?? createDefaultMatrix().matrixColumns}
              matrixRows={answer.matrixRows ?? createDefaultMatrix().matrixRows}
              onChange={(next) => onChange({ ...answer, ...next })}
            />
          </Box>
        );
      case 'MATCHING':
        return <MatchingAnswer question={question} answer={answer} onChange={onChange} />;
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

const TopicSelectionView = ({ exam, groups, answers, onSelectTopic, timer }) => {
  const totalQuestions = groups.reduce((s, g) => s + g.questions.length, 0);
  const totalAnswered = groups.reduce((s, g) => s + g.questions.filter((q) => isAnswered(q, answers[q.id])).length, 0);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ p: 4, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56' }}>{exam.title}</Typography>
          {timer && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1, bgcolor: timer.isDanger ? '#ffebee' : timer.isWarning ? '#fff3e0' : '#e3f2fd',
              border: `1px solid ${timer.isDanger ? '#ef9a9a' : timer.isWarning ? '#ffcc80' : '#90caf9'}`,
              borderRadius: 2, px: 2, py: 1,
            }}>
              <TimerIcon sx={{ fontSize: 18, color: timer.isDanger ? '#c62828' : timer.isWarning ? '#e65100' : '#1565c0' }} />
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: timer.isDanger ? '#c62828' : timer.isWarning ? '#e65100' : '#1565c0', letterSpacing: 1 }}>
                {timer.displayTime}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', ml: 0.5 }}>
                {timer.hasLimit ? 'restante' : 'transcurrido'}
              </Typography>
            </Box>
          )}
        </Box>
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
            const topicAnswered = group.questions.filter((q) => isAnswered(q, answers[q.id])).length;
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

const TimerChip = ({ displayTime, hasLimit, isWarning, isDanger, expired }) => {
  let bg = 'rgba(255,255,255,0.15)';
  let color = '#fff';
  if (expired) { bg = '#b71c1c'; color = '#fff'; }
  else if (isDanger) { bg = '#e53935'; color = '#fff'; }
  else if (isWarning) { bg = '#fb8c00'; color = '#fff'; }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: bg, borderRadius: 1.5, px: 1.5, py: 0.5, flexShrink: 0 }}>
      <TimerIcon sx={{ fontSize: 16, color }} />
      <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color, letterSpacing: 1 }}>
        {displayTime}
      </Typography>
      {!hasLimit && (
        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', ml: 0.25 }}>transcurrido</Typography>
      )}
    </Box>
  );
};

TimerChip.propTypes = {
  displayTime: PropTypes.string.isRequired,
  hasLimit: PropTypes.bool.isRequired,
  isWarning: PropTypes.bool,
  isDanger: PropTypes.bool,
  expired: PropTypes.bool,
};

const TopicQuestionsView = ({ group, topicIdx, answers, onAnswerChange, onFinish, violationCount, timer }) => {
  const color = group.color || '#001f56';
  const answered = group.questions.filter((q) => isAnswered(q, answers[q.id])).length;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header coloreado */}
      <Box sx={{ bgcolor: color, px: 4, py: 3, position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
          {timer && <TimerChip {...timer} />}
          {violationCount > 0 && (
            <Tooltip title={`${violationCount} infracción${violationCount !== 1 ? 'es' : ''} registrada${violationCount !== 1 ? 's' : ''}`}>
              <Badge badgeContent={violationCount} color="error">
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1, p: 0.75, display: 'flex', alignItems: 'center' }}>
                  <WarningAmberIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
              </Badge>
            </Tooltip>
          )}
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pb: 4 }}>
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

const TimerShape = PropTypes.shape({
  displayTime: PropTypes.string,
  hasLimit: PropTypes.bool,
  isWarning: PropTypes.bool,
  isDanger: PropTypes.bool,
  expired: PropTypes.bool,
  elapsed: PropTypes.number,
});

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
  timer: TimerShape,
};

TopicQuestionsView.propTypes = {
  group: GroupShape.isRequired,
  topicIdx: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  violationCount: PropTypes.number,
  timer: TimerShape,
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const lsKey = (examId, suffix) => `examia_exam_${examId}_${suffix}`;

const saveProgress = (examId, answers) => {
  try { localStorage.setItem(lsKey(examId, 'answers'), JSON.stringify(answers)); } catch {}
};

const clearProgress = (examId) => {
  try {
    localStorage.removeItem(lsKey(examId, 'answers'));
    localStorage.removeItem(lsKey(examId, 'started_at'));
    clearSavedViolations(examId);
  } catch {}
};

const getStartedAt = (examId) => {
  try {
    const ts = localStorage.getItem(lsKey(examId, 'started_at'));
    return ts ? parseInt(ts, 10) : null;
  } catch { return null; }
};

const setStartedAt = (examId) => {
  try {
    if (!localStorage.getItem(lsKey(examId, 'started_at'))) {
      localStorage.setItem(lsKey(examId, 'started_at'), String(Date.now()));
    }
  } catch {}
};

const getSavedAnswers = (examId) => {
  try {
    const raw = localStorage.getItem(lsKey(examId, 'answers'));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
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
  const [examStarted, setExamStarted] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [initialElapsed, setInitialElapsed] = useState(0);
  // Pantalla de inicio: el alumno debe activar fullscreen antes de comenzar
  const [readyToStart, setReadyToStart] = useState(false);

  // 'topics' | 'questions'
  const [view, setView] = useState('topics');
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const { violations, violationCount, violationsPayload, warningOpen, lastViolation, dismissWarning,
          isFullscreen, fullscreenExitOpen, reEnterFullscreen } =
    useExamProctoring({ enabled: examStarted && !loading && !alreadySubmitted, examId });

  // Auto-guardar respuestas en localStorage cada vez que cambian
  useEffect(() => {
    if (!examStarted || loading) return;
    saveProgress(examId, answers);
  }, [answers, examStarted, loading, examId]);

  const handleTimeUp = useCallback(() => {
    setConfirmOpen(false);
    const autoSubmit = async () => {
      setSubmitting(true);
      try {
        const allQuestions = groups.flatMap((g) => g.questions);
        const answersList = allQuestions.map((q) => buildSubmitPayload(q, answers[q.id]));
        const elapsed = Math.floor((Date.now() - (getStartedAt(examId) ?? Date.now())) / 1000);
        await SubmissionService.submitExam(examId, answersList, violationsPayload, elapsed);
        clearProgress(examId);
        setExamStarted(false);
        setSnackbar({ open: true, message: 'Tiempo agotado — examen entregado automáticamente.', severity: 'warning' });
        setTimeout(() => navigate('/alumno'), 2000);
      } catch {
        setSnackbar({ open: true, message: 'Tiempo agotado. No se pudo entregar automáticamente.', severity: 'error' });
      } finally {
        setSubmitting(false);
      }
    };
    autoSubmit();
  }, [groups, answers, examId, violationsPayload, navigate]);

  const timer = useExamTimer({
    durationMinutes: exam?.durationMinutes ?? null,
    enabled: examStarted && !loading && !alreadySubmitted,
    onTimeUp: handleTimeUp,
    initialElapsed,
  });

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

        // Calcular tiempo transcurrido desde el inicio real
        const startedAt = getStartedAt(examId);
        const elapsedSoFar = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;

        // Verificar si el tiempo ya venció antes de cargar
        if (data.durationMinutes > 0 && elapsedSoFar >= data.durationMinutes * 60) {
          // Tiempo vencido durante el reload — entregar automáticamente
          const savedAns = getSavedAnswers(examId) ?? {};
          const allQuestions = [...seen.values()].flatMap((g) => g.questions);
          const answersList = allQuestions.map((q) => {
            const saved = savedAns[q.id];
            return buildSubmitPayload(q, saved ?? emptyAnswer(q));
          });
          try {
            await SubmissionService.submitExam(examId, answersList, [], elapsedSoFar);
          } catch {}
          clearProgress(examId);
          setAlreadySubmitted(true);
          setLoading(false);
          return;
        }

        setInitialElapsed(elapsedSoFar);

        // Restaurar respuestas guardadas o inicializar vacías
        const savedAnswers = getSavedAnswers(examId);
        const initial = {};
        qs.forEach((q) => { initial[q.id] = emptyAnswer(q); });

        if (savedAnswers) {
          qs.forEach((q) => { initial[q.id] = savedAnswers[q.id] ?? emptyAnswer(q); });
          setRecovered(true);
        }

        setAnswers(initial);

        if (savedAnswers) {
          // Ya estaba en progreso (reload): iniciar directo y pedir fullscreen
          setStartedAt(examId);
          setExamStarted(true);
        } else {
          // Primera vez: mostrar pantalla de inicio para pedir fullscreen
          setStartedAt(examId);
          setReadyToStart(true);
        }
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

  const buildSubmitPayload = (question, answerState) => {
    const a = answerState ?? emptyAnswer(question);
    const base = { questionId: question.id };
    switch (question.type) {
      case 'DECISION_TREE':
        return { ...base, decisionTree: a.decisionTree };
      case 'MATRIX':
        return {
          ...base,
          matrixColumnHeaders: a.matrixColumns,
          matrixRows: a.matrixRows,
        };
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
      case 'MULTIPLE_SELECTION':
        return { ...base, selectedOptions: a.selectedOptions };
      case 'LONG_ANSWER':
      case 'SHORT_ANSWER':
      case 'FILL_IN_THE_BLANK':
        return { ...base, textAnswer: a.textAnswer };
      case 'ORDERING':
        return { ...base, orderAnswer: a.orderAnswer };
      case 'MATCHING':
        return { ...base, matchingAnswer: a.matchingAnswer };
      default:
        return base;
    }
  };

  const allQuestions = groups.flatMap((g) => g.questions);
  const totalQuestions = allQuestions.length;
  const totalAnswered = allQuestions.filter((q) => isAnswered(q, answers[q.id])).length;

  const handleSubmit = async () => {
    setSubmitting(true);
    timer.stop();
    try {
      const answersList = allQuestions.map((q) => buildSubmitPayload(q, answers[q.id]));
      const startedAt = getStartedAt(examId);
      const elapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : timer.elapsed;
      await SubmissionService.submitExam(examId, answersList, violationsPayload, elapsed);
      clearProgress(examId);
      setConfirmOpen(false);
      setExamStarted(false);
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

  // Pantalla de inicio — pedir fullscreen antes de comenzar
  if (readyToStart && !examStarted && exam) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#001f56', gap: 3, p: 4 }}>
        <LockIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.9)' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}>
          {exam.title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: 480 }}>
          Este examen se realiza en <strong>pantalla completa</strong>. No podrás cambiar de pestaña, minimizar la ventana ni salir de pantalla completa sin que quede registrado.
        </Typography>
        {exam.durationMinutes && (
          <Chip
            icon={<TimerIcon sx={{ color: '#fff !important' }} />}
            label={`Tiempo máximo: ${exam.durationMinutes} minutos`}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', px: 1 }}
          />
        )}
        <Button
          variant="contained"
          size="large"
          startIcon={<FullscreenIcon />}
          onClick={() => {
            enterFullscreen()
              .then(() => { setReadyToStart(false); setExamStarted(true); })
              .catch(() => { setReadyToStart(false); setExamStarted(true); });
          }}
          sx={{ mt: 2, bgcolor: '#fff', color: '#001f56', fontWeight: 700, fontSize: '1rem', px: 5, py: 1.5, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#e3f2fd' } }}
        >
          Comenzar examen en pantalla completa
        </Button>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
          Presioná Esc para salir de pantalla completa en cualquier momento — quedará registrado como infracción.
        </Typography>
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
          timer={timer}
        />
      )}

      {view === 'questions' && selectedGroup && (
        <TopicQuestionsView
          group={selectedGroup}
          topicIdx={selectedTopicIdx}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onFinish={() => setConfirmOpen(true)}
          violationCount={violationCount}
          timer={timer}
        />
      )}

      {/* Dialog bloqueante de salida de pantalla completa */}
      <Dialog open={fullscreenExitOpen} onClose={() => {}} disableEscapeKeyDown maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#b71c1c', fontWeight: 700 }}>
          <FullscreenExitIcon sx={{ fontSize: 28 }} />
          ¡Saliste de pantalla completa!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            Salir de pantalla completa durante el examen <strong>queda registrado como infracción</strong>.
          </DialogContentText>
          <DialogContentText sx={{ color: '#b71c1c', fontWeight: 600 }}>
            Debés volver a pantalla completa para continuar.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={reEnterFullscreen}
            variant="contained"
            startIcon={<FullscreenIcon />}
            sx={{ bgcolor: '#001f56', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: '#003080' } }}
          >
            Volver a pantalla completa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de infracción de vigilancia */}
      <Dialog open={warningOpen} onClose={dismissWarning} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#b71c1c', fontWeight: 700 }}>
          <VisibilityOffIcon sx={{ fontSize: 28 }} />
          ¡Infracción detectada!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1.5 }}>
            Se detectó que abandonaste el examen:{' '}
            <strong>{lastViolation?.label ?? 'salida de ventana'}</strong>.
          </DialogContentText>
          <DialogContentText sx={{ color: '#b71c1c', fontWeight: 600 }}>
            Esta acción quedó registrada. Total de infracciones: {violationCount}.
          </DialogContentText>
          {violationCount >= 3 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Tenés {violationCount} infracciones registradas. El docente será notificado al recibir tu examen.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={dismissWarning}
            variant="contained"
            sx={{ bgcolor: '#b71c1c', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: '#7f0000' } }}
          >
            Entendido, volver al examen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#001f56' }}>Confirmar entrega</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Respondiste {totalAnswered} de {totalQuestions} pregunta{totalQuestions === 1 ? '' : 's'} del examen.
            {totalAnswered < totalQuestions && ` Hay ${totalQuestions - totalAnswered} sin responder.`} ¿Querés entregar el examen?
          </DialogContentText>
          {violationCount > 0 && (
            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 2 }}>
              Se registraron <strong>{violationCount} infracción{violationCount !== 1 ? 'es' : ''}</strong> durante el examen (cambios de pestaña o ventana). Esto quedará en tu entrega.
            </Alert>
          )}
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

      {/* Banner de progreso recuperado tras reload */}
      <Snackbar
        open={recovered}
        autoHideDuration={5000}
        onClose={() => setRecovered(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setRecovered(false)} severity="info" sx={{ width: '100%' }}>
          Tus respuestas anteriores fueron recuperadas automáticamente.
        </Alert>
      </Snackbar>
    </>
  );
};

export default RealizarExamenContent;
