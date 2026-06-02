import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SubmissionService from '../../../../../application/services/SubmissionService';
import { AnswerSection, DecisionTreeComparison, MatrixComparison } from '../../../../components/correctionAnswerViews';
import CorrectionQuestionFooter from './correctionQuestionFooter';

// ─── helpers ──────────────────────────────────────────────────────────────────

const QUESTION_TYPE_LABELS = {
  MULTIPLE_CHOICE: 'Opción múltiple',
  MULTIPLE_SELECTION: 'Selección múltiple',
  TRUE_FALSE: 'Verdadero / Falso',
  SHORT_ANSWER: 'Respuesta corta',
  LONG_ANSWER: 'Respuesta extensa',
  FILL_IN_THE_BLANK: 'Completar',
  ORDERING: 'Ordenar',
  DECISION_TREE: 'Árbol de decisión',
  MATCHING: 'Emparejar',
  MATRIX: 'Matriz',
};

const AUTO_GRADABLE = ['MULTIPLE_CHOICE', 'MULTIPLE_SELECTION', 'TRUE_FALSE', 'ORDERING'];
const isAutoGradable = (type) => AUTO_GRADABLE.includes(type);

const AnswerShape = PropTypes.shape({
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  questionType: PropTypes.string,
  points: PropTypes.number,
  earnedScore: PropTypes.number,
  teacherFeedback: PropTypes.string,
  questionText: PropTypes.string,
  correctAnswers: PropTypes.arrayOf(PropTypes.number),
  selectedOptions: PropTypes.arrayOf(PropTypes.number),
  orderAnswer: PropTypes.arrayOf(PropTypes.string),
  correctOrder: PropTypes.arrayOf(PropTypes.string),
  decisionTree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  matchingPairs: PropTypes.objectOf(PropTypes.string),
  matrixColumnHeaders: PropTypes.arrayOf(PropTypes.string),
  matrixRows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  studentDecisionTree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  studentMatrixColumnHeaders: PropTypes.arrayOf(PropTypes.string),
  studentMatrixRows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  matchingAnswer: PropTypes.objectOf(PropTypes.string),
  correctTextAnswer: PropTypes.string,
  textAnswer: PropTypes.string,
});

const normalizeCorrectionAnswer = (answer) => ({
  ...answer,
  studentDecisionTree: answer.studentDecisionTree ?? answer.student_decision_tree ?? null,
  studentMatrixColumnHeaders:
    answer.studentMatrixColumnHeaders ?? answer.student_matrix_column_headers ?? null,
  studentMatrixRows: answer.studentMatrixRows ?? answer.student_matrix_rows ?? null,
});

const autoScore = (answer) => {
  if (answer.questionType === 'MULTIPLE_CHOICE' || answer.questionType === 'TRUE_FALSE') {
    const selected = (answer.selectedOptions || []).slice().sort().join(',');
    const correct = (answer.correctAnswers || []).slice().sort().join(',');
    return selected === correct ? answer.points : 0;
  }
  if (answer.questionType === 'MULTIPLE_SELECTION') {
    const correct = new Set(answer.correctAnswers || []);
    const selected = new Set(answer.selectedOptions || []);
    const hits = [...correct].filter((c) => selected.has(c)).length;
    const wrong = [...selected].filter((s) => !correct.has(s)).length;
    const net = Math.max(0, hits - wrong);
    return correct.size > 0 ? Number.parseFloat(((net / correct.size) * answer.points).toFixed(2)) : 0;
  }
  if (answer.questionType === 'ORDERING') {
    const correct = answer.correctOrder || [];
    const student = answer.orderAnswer || [];
    const ok = correct.length === student.length && correct.every((item, idx) => item === student[idx]);
    return ok ? answer.points : 0;
  }
  return null;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// ─── Sub-componentes para mostrar respuestas ──────────────────────────────────

const MultipleChoiceAnswer = ({ answer }) => (
  <Stack spacing={1} sx={{ mt: 1.5 }}>
    {(answer.options || []).map((opt, idx) => {
      const isCorrect = (answer.correctAnswers || []).includes(idx);
      const isSelected = (answer.selectedOptions || []).includes(idx);
      let bgcolor = '#f5f5f5', textColor = '#333';
      let Icon = RadioButtonUncheckedIcon, iconColor = '#bbb';

      if (isCorrect && isSelected) {
        bgcolor = '#e8f5e9'; textColor = '#2e7d32';
        Icon = CheckCircleIcon; iconColor = '#2e7d32';
      } else if (!isCorrect && isSelected) {
        bgcolor = '#fce4ec'; textColor = '#c62828';
        Icon = CancelIcon; iconColor = '#c62828';
      } else if (isCorrect && !isSelected) {
        bgcolor = '#e3f2fd'; textColor = '#1565c0';
        Icon = CheckCircleIcon; iconColor = '#1565c0';
      }

      return (
        <Box key={idx} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor, borderRadius: 1, px: 2, py: 1,
          border: isSelected ? `1px solid ${iconColor}` : '1px solid transparent',
        }}>
          <Icon sx={{ fontSize: 20, color: iconColor, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: textColor, fontWeight: isSelected ? 500 : 400, flex: 1 }}>
            {opt}
          </Typography>
          {isCorrect && (
            <Chip label="Correcta" size="small" sx={{ ml: 'auto', bgcolor: 'transparent', color: iconColor, fontSize: '0.7rem', height: 20, border: `1px solid ${iconColor}` }} />
          )}
        </Box>
      );
    })}
    <Typography variant="caption" sx={{ color: '#888' }}>
      Azul = correcta no marcada · Verde = correcto · Rojo = incorrecto
    </Typography>
  </Stack>
);

const TextBlock = ({ text, emptyMessage }) => (
  <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0', whiteSpace: 'pre-wrap' }}>
    {text?.trim() ? (
      <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7 }}>{text}</Typography>
    ) : (
      <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>{emptyMessage}</Typography>
    )}
  </Box>
);

const TextAnswer = ({ answer }) => (
  <Stack spacing={2} sx={{ mt: 1.5 }}>
    <AnswerSection title="Respuesta modelo del profesor (guía de corrección)">
      <TextBlock text={answer.correctTextAnswer} emptyMessage="Sin respuesta modelo configurada." />
    </AnswerSection>
    <AnswerSection title="Respuesta del alumno">
      <TextBlock text={answer.textAnswer} emptyMessage="El alumno no respondió esta pregunta." />
    </AnswerSection>
  </Stack>
);

const OrderingAnswer = ({ answer }) => {
  const correct = answer.correctOrder || [];
  const student = answer.orderAnswer || [];
  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Orden del alumno:</Typography>
      {student.map((item, idx) => {
        const ok = correct[idx] === item;
        return (
          <Box key={`${item}-${idx}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: ok ? '#e8f5e9' : '#fce4ec', border: `1px solid ${ok ? '#a5d6a7' : '#ef9a9a'}`, borderRadius: 1, px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#666', minWidth: 20 }}>{idx + 1}.</Typography>
            <Typography variant="body2" sx={{ flex: 1, color: '#333' }}>{item}</Typography>
            {ok ? <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> : <CancelIcon sx={{ fontSize: 18, color: '#c62828' }} />}
          </Box>
        );
      })}
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Orden correcto:</Typography>
      {correct.map((item, idx) => (
        <Box key={`correct-${item}-${idx}`} sx={{ display: 'flex', gap: 1.5, px: 2, py: 0.75, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #90caf9' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1565c0', minWidth: 20 }}>{idx + 1}.</Typography>
          <Typography variant="body2" sx={{ color: '#1565c0' }}>{item}</Typography>
        </Box>
      ))}
    </Stack>
  );
};

const MatchingAnswer = ({ answer }) => {
  const correct = answer.matchingPairs || {};
  const student = answer.matchingAnswer || {};
  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Respuesta del alumno:</Typography>
      {Object.entries(student).map(([key, val]) => {
        const ok = correct[key] === val;
        return (
          <Box key={key} sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: ok ? '#e8f5e9' : '#fce4ec', borderRadius: 1, px: 2, py: 1, border: `1px solid ${ok ? '#a5d6a7' : '#ef9a9a'}` }}>
            <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 120, color: '#333' }}>{key}</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>→</Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>{val}</Typography>
            {ok ? <CheckCircleIcon sx={{ ml: 'auto', fontSize: 18, color: '#2e7d32' }} /> : <CancelIcon sx={{ ml: 'auto', fontSize: 18, color: '#c62828' }} />}
          </Box>
        );
      })}
    </Stack>
  );
};

// ─── Card de pregunta ─────────────────────────────────────────────────────────

const QuestionHeader = ({ answer, index, isAuto, readOnly, scoreNum }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>Pregunta {index + 1}</Typography>
      <Chip
        label={QUESTION_TYPE_LABELS[answer.questionType] || answer.questionType}
        size="small"
        sx={{ bgcolor: isAuto ? '#e3f2fd' : '#f3e5f5', color: isAuto ? '#1565c0' : '#6a1b9a', fontSize: '0.72rem', height: 22 }}
      />
      {isAuto && (
        <Chip label="Auto-corregida" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontSize: '0.72rem', height: 22 }} />
      )}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      {readOnly && scoreNum != null ? (
        <Chip
          label={`${scoreNum} / ${answer.points} pts`}
          size="small"
          sx={{ bgcolor: scoreNum >= answer.points ? '#e8f5e9' : '#fff3e0', color: scoreNum >= answer.points ? '#2e7d32' : '#e65100', fontWeight: 700, fontSize: '0.75rem' }}
        />
      ) : (
        <Typography variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
          {answer.points} pt{answer.points !== 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  </Box>
);

const CHOICE_TYPES = ['MULTIPLE_CHOICE', 'MULTIPLE_SELECTION', 'TRUE_FALSE'];
const TEXT_TYPES = ['LONG_ANSWER', 'SHORT_ANSWER', 'FILL_IN_THE_BLANK'];

const renderQuestionBody = (answer) => {
  if (CHOICE_TYPES.includes(answer.questionType)) return <MultipleChoiceAnswer answer={answer} />;
  if (TEXT_TYPES.includes(answer.questionType)) return <TextAnswer answer={answer} />;
  if (answer.questionType === 'ORDERING') return <OrderingAnswer answer={answer} />;
  if (answer.questionType === 'DECISION_TREE') return <DecisionTreeComparison answer={answer} />;
  if (answer.questionType === 'MATRIX') return <MatrixComparison answer={answer} />;
  if (answer.questionType === 'MATCHING') return <MatchingAnswer answer={answer} />;
  return null;
};

const QuestionBody = ({ answer }) => renderQuestionBody(answer);

QuestionHeader.propTypes = {
  answer: AnswerShape.isRequired,
  index: PropTypes.number.isRequired,
  isAuto: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  scoreNum: PropTypes.number,
};

QuestionBody.propTypes = {
  answer: AnswerShape.isRequired,
};

const QuestionCard = ({ answer, index, scoreValue, feedbackValue, onScoreChange, onFeedbackChange, readOnly }) => {
  const isAuto = isAutoGradable(answer.questionType);
  const scoreNum = readOnly ? answer.earnedScore : Number.parseFloat(scoreValue);

  return (
    <Paper elevation={0} sx={{
      border: '1px solid #e0e0e0', borderRadius: 2, p: 3, mb: 3,
      borderLeft: isAuto ? '4px solid #42a5f5' : '4px solid #7c3aed',
    }}>
      <QuestionHeader answer={answer} index={index} isAuto={isAuto} readOnly={readOnly} scoreNum={scoreNum} />

      <Typography variant="body1" sx={{ fontWeight: 500, color: '#222', mb: 1.5, lineHeight: 1.5 }}>
        {answer.questionText}
      </Typography>

      <QuestionBody answer={answer} />

      <Divider sx={{ my: 2.5 }} />
      <CorrectionQuestionFooter
        answer={answer}
        readOnly={readOnly}
        scoreValue={scoreValue}
        feedbackValue={feedbackValue}
        onScoreChange={onScoreChange}
        onFeedbackChange={onFeedbackChange}
      />
    </Paper>
  );
};

QuestionCard.propTypes = {
  answer: AnswerShape.isRequired,
  index: PropTypes.number.isRequired,
  scoreValue: PropTypes.string,
  feedbackValue: PropTypes.string,
  onScoreChange: PropTypes.func.isRequired,
  onFeedbackChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

const LoadingView = () => (
  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress sx={{ color: '#001f56' }} />
  </Box>
);

const ErrorView = ({ error, onBack }) => (
  <Box sx={{ p: 4 }}>
    <Alert severity="error">{error}</Alert>
    <Button sx={{ mt: 2 }} onClick={onBack}>Volver</Button>
  </Box>
);

ErrorView.propTypes = {
  error: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

const groupAnswersByTopic = (answers) => {
  const topics = [];
  const seenTopics = new Set();

  answers.forEach((answer) => {
    const topic = answer.topic || 'Sin tema';
    if (!seenTopics.has(topic)) {
      seenTopics.add(topic);
      topics.push(topic);
    }
  });

  return {
    topics,
    hasTemas: topics.length > 1 || (topics.length === 1 && topics[0] !== 'Sin tema'),
  };
};

const TopicAnswersSection = ({ submission, questionScores, onScoreChange, onFeedbackChange, readOnly }) => {
  const answers = submission.answers || [];
  const { topics, hasTemas } = groupAnswersByTopic(answers);
  let globalIdx = 0;

  return (
    <>
      {topics.map((topic) => {
        const topicAnswers = answers.filter((a) => (a.topic || 'Sin tema') === topic);
        return (
          <Box key={topic}>
            {hasTemas && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: globalIdx > 0 ? 1 : 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#001f56' }}>{topic}</Typography>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" sx={{ color: '#888', flexShrink: 0 }}>
                  {topicAnswers.reduce((s, a) => s + (a.points || 0), 0)} pts
                </Typography>
              </Box>
            )}
            {topicAnswers.map((answer) => {
              const idx = globalIdx++;
              return (
                <QuestionCard
                  key={answer.questionId}
                  answer={answer}
                  index={idx}
                  scoreValue={questionScores[answer.questionId]?.score ?? ''}
                  feedbackValue={questionScores[answer.questionId]?.feedback ?? ''}
                  onScoreChange={onScoreChange}
                  onFeedbackChange={onFeedbackChange}
                  readOnly={readOnly}
                />
              );
            })}
          </Box>
        );
      })}
    </>
  );
};

TopicAnswersSection.propTypes = {
  submission: PropTypes.shape({
    answers: PropTypes.arrayOf(AnswerShape),
  }).isRequired,
  questionScores: PropTypes.object.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onFeedbackChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

const GeneralFeedbackSection = ({ readOnly, teacherFeedback, setTeacherFeedback }) => (
  <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, mb: 3 }}>
    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 1.5 }}>
      Comentario general
    </Typography>
    {readOnly ? (
      teacherFeedback ? (
        <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {teacherFeedback}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>Sin comentario general.</Typography>
      )
    ) : (
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="Escribí un comentario general para el alumno..."
        value={teacherFeedback}
        onChange={(e) => setTeacherFeedback(e.target.value)}
      />
    )}
  </Paper>
);

GeneralFeedbackSection.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  teacherFeedback: PropTypes.string,
  setTeacherFeedback: PropTypes.func.isRequired,
};

const ReviewActions = ({ readOnly, allScored, hasValidScores, saving, handleSubmit, onCancel }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pb: 4 }}>
    {readOnly ? (
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{ textTransform: 'none', borderColor: '#001f56', color: '#001f56' }}
      >
        Volver
      </Button>
    ) : (
      <>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ textTransform: 'none', borderColor: '#001f56', color: '#001f56' }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!allScored || !hasValidScores || saving}
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{
            bgcolor: '#001f56', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3,
            '&:hover': { bgcolor: '#003080' },
            '&:disabled': { bgcolor: '#ccc' },
          }}
        >
          {saving ? 'Guardando...' : 'Guardar corrección'}
        </Button>
      </>
    )}
  </Box>
);

ReviewActions.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  allScored: PropTypes.bool.isRequired,
  hasValidScores: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const CorreccionDetalleContent = ({ examId, submissionId }) => {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [questionScores, setQuestionScores] = useState({});
  const [teacherFeedback, setTeacherFeedback] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSubmission = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await SubmissionService.getSubmission(examId, submissionId);
        if (!mounted) return;

        setSubmission({
          ...data,
          answers: (data.answers || []).map(normalizeCorrectionAnswer),
        });
        const initialScores = {};

        (data.answers || []).map(normalizeCorrectionAnswer).forEach((ans) => {
          const auto = autoScore(ans);
          initialScores[ans.questionId] = {
            score: auto === null ? '' : String(auto),
            feedback: ans.teacherFeedback || '',
          };
        });

        setQuestionScores(initialScores);
        if (data.teacherFeedback) setTeacherFeedback(data.teacherFeedback);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar la entrega');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSubmission();
    return () => { mounted = false; };
  }, [examId, submissionId]);

  const handleScoreChange = useCallback((questionId, value) => {
    setQuestionScores((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], score: value },
    }));
  }, []);

  const handleFeedbackChange = useCallback((questionId, value) => {
    setQuestionScores((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], feedback: value },
    }));
  }, []);

  const totalScore = Object.values(questionScores).reduce((acc, { score }) => {
    const numeric = parseFloat(score);
    return acc + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  const allScored = submission
    ? (submission.answers || []).every(({ questionId }) => !isNaN(parseFloat(questionScores[questionId]?.score)))
    : false;

  const hasValidScores = submission
    ? (submission.answers || []).every(({ questionId, points }) => {
        const value = parseFloat(questionScores[questionId]?.score);
        return !isNaN(value) && value >= 0 && value <= points;
      })
    : false;

  const handleSubmit = async () => {
    if (!allScored || !hasValidScores) return;

    setSaving(true);
    try {
      const questionGrades = (submission.answers || []).map(({ questionId }) => ({
        questionId,
        score: parseFloat(questionScores[questionId].score),
        feedback: questionScores[questionId].feedback || '',
      }));

      await SubmissionService.gradeSubmission(examId, submissionId, {
        questionGrades,
        totalScore: parseFloat(totalScore.toFixed(2)),
        teacherFeedback,
      });

      setSnackbar({ open: true, message: 'Corrección guardada exitosamente.', severity: 'success' });
      setTimeout(() => navigate('/docente/correcciones'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Error al guardar la corrección.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error} onBack={() => navigate('/docente/correcciones')} />;
  if (!submission) return null;

  const readOnly = submission.status === 'GRADED';

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 4, pb: 2 }}>
        <Tooltip title="Volver a entregas">
          <IconButton onClick={() => navigate('/docente/correcciones')} sx={{ mt: 0.25, color: '#001f56' }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.25 }}>
            {readOnly ? 'Corrección guardada' : 'Corrección'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>{submission.examTitle}</Typography>
        </Box>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, px: 3, py: 1.5, textAlign: 'center', minWidth: 100 }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>Puntaje total</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#001f56' }}>
            {readOnly ? (submission.totalScore ?? '—') : (allScored ? totalScore.toFixed(1) : '—')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#888' }}>/ {submission.totalPoints}</Typography>
        </Paper>
      </Box>

      <Box sx={{ px: 4, pb: 2 }}>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff' }}>
          <PersonIcon sx={{ color: '#001f56', fontSize: 32 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#001f56' }}>
              {submission.student?.name || 'Alumno'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {submission.student?.legajo ? `Legajo: ${submission.student.legajo} · ` : ''}
              {submission.student?.email || ''}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: '#888' }}>Entregado</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
              {formatDate(submission.submittedAt)}
            </Typography>
            {readOnly && submission.gradedAt && (
              <>
                <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 0.5 }}>Corregido</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                  {formatDate(submission.gradedAt)}
                </Typography>
              </>
            )}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ px: 4, pb: 2, flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
          Respuestas ({(submission.answers || []).length} pregunta{(submission.answers || []).length !== 1 ? 's' : ''})
        </Typography>

        <TopicAnswersSection
          submission={submission}
          questionScores={questionScores}
          onScoreChange={handleScoreChange}
          onFeedbackChange={handleFeedbackChange}
          readOnly={readOnly}
        />

        <GeneralFeedbackSection
          readOnly={readOnly}
          teacherFeedback={submission.teacherFeedback}
          setTeacherFeedback={setTeacherFeedback}
        />

        {!readOnly && !allScored && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Asigná un puntaje a todas las preguntas antes de guardar la corrección.
          </Alert>
        )}
        {!readOnly && allScored && !hasValidScores && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Algunos puntajes están fuera del rango permitido. Revisalos antes de guardar.
          </Alert>
        )}

        <ReviewActions
          readOnly={readOnly}
          allScored={allScored}
          hasValidScores={hasValidScores}
          saving={saving}
          handleSubmit={handleSubmit}
          onCancel={() => navigate('/docente/correcciones')}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CorreccionDetalleContent;
