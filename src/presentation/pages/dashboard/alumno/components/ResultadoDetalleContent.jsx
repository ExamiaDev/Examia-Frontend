import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SubmissionService from '../../../../../application/services/SubmissionService';

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

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// ─── Respuestas por tipo ───────────────────────────────────────────────────────

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

const TextAnswer = ({ answer }) => (
  <Box sx={{ mt: 1.5, p: 2, bgcolor: '#f9f9f9', borderRadius: 1, border: '1px solid #e0e0e0', whiteSpace: 'pre-wrap' }}>
    {answer.textAnswer ? (
      <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7 }}>{answer.textAnswer}</Typography>
    ) : (
      <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>No respondiste esta pregunta.</Typography>
    )}
  </Box>
);

const OrderingAnswer = ({ answer }) => {
  const correct = answer.correctOrder || [];
  const student = answer.orderAnswer || [];
  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Tu orden:</Typography>
      {student.map((item, idx) => {
        const ok = correct[idx] === item;
        return (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: ok ? '#e8f5e9' : '#fce4ec', border: `1px solid ${ok ? '#a5d6a7' : '#ef9a9a'}`, borderRadius: 1, px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#666', minWidth: 20 }}>{idx + 1}.</Typography>
            <Typography variant="body2" sx={{ flex: 1, color: '#333' }}>{item}</Typography>
            {ok ? <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> : <CancelIcon sx={{ fontSize: 18, color: '#c62828' }} />}
          </Box>
        );
      })}
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Orden correcto:</Typography>
      {correct.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 1.5, px: 2, py: 0.75, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #90caf9' }}>
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
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>Tu respuesta:</Typography>
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

// ─── Card de pregunta (solo lectura) ──────────────────────────────────────────

const QuestionCard = ({ answer, index }) => {
  const isAuto = ['MULTIPLE_CHOICE', 'MULTIPLE_SELECTION', 'TRUE_FALSE'].includes(answer.questionType);

  return (
    <Paper elevation={0} sx={{
      border: '1px solid #e0e0e0', borderRadius: 2, p: 3, mb: 3,
      borderLeft: isAuto ? '4px solid #42a5f5' : '4px solid #7c3aed',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>Pregunta {index + 1}</Typography>
          <Chip
            label={QUESTION_TYPE_LABELS[answer.questionType] || answer.questionType}
            size="small"
            sx={{ bgcolor: isAuto ? '#e3f2fd' : '#f3e5f5', color: isAuto ? '#1565c0' : '#6a1b9a', fontSize: '0.72rem', height: 22 }}
          />
        </Box>
        {answer.earnedScore != null && (
          <Chip
            label={`${answer.earnedScore} / ${answer.points} pts`}
            size="small"
            sx={{
              bgcolor: answer.earnedScore >= answer.points ? '#e8f5e9' : answer.earnedScore > 0 ? '#fff3e0' : '#fce4ec',
              color: answer.earnedScore >= answer.points ? '#2e7d32' : answer.earnedScore > 0 ? '#e65100' : '#c62828',
              fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
            }}
          />
        )}
      </Box>

      <Typography variant="body1" sx={{ fontWeight: 500, color: '#222', mb: 1.5, lineHeight: 1.5 }}>
        {answer.questionText}
      </Typography>

      {(answer.questionType === 'MULTIPLE_CHOICE' || answer.questionType === 'MULTIPLE_SELECTION' || answer.questionType === 'TRUE_FALSE') && (
        <MultipleChoiceAnswer answer={answer} />
      )}
      {(answer.questionType === 'LONG_ANSWER' || answer.questionType === 'SHORT_ANSWER' || answer.questionType === 'FILL_IN_THE_BLANK') && (
        <TextAnswer answer={answer} />
      )}
      {(answer.questionType === 'ORDERING' || answer.questionType === 'DECISION_TREE') && <OrderingAnswer answer={answer} />}
      {(answer.questionType === 'MATCHING' || answer.questionType === 'MATRIX') && <MatchingAnswer answer={answer} />}

      {answer.teacherFeedback && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ bgcolor: '#fffde7', borderRadius: 1, px: 2, py: 1.5, border: '1px solid #fff176' }}>
            <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 600, display: 'block', mb: 0.5 }}>
              Comentario del docente
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{answer.teacherFeedback}</Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

const AnswerShape = PropTypes.shape({
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  questionType: PropTypes.string,
  orderAnswer: PropTypes.arrayOf(PropTypes.string),
  matchingPairs: PropTypes.objectOf(PropTypes.string),
  matchingAnswer: PropTypes.objectOf(PropTypes.string),
  earnedScore: PropTypes.number,
  points: PropTypes.number,
  teacherFeedback: PropTypes.string,
  questionText: PropTypes.string,
});

QuestionCard.propTypes = {
  answer: AnswerShape.isRequired,
  index: PropTypes.number.isRequired,
};

// ─── Componente principal ─────────────────────────────────────────────────────

const ResultadoDetalleContent = ({ submissionId }) => {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SubmissionService.getMySubmission(submissionId);
        if (mounted) setSubmission(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar el resultado');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [submissionId]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#001f56' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/alumno/resultados')}>Volver</Button>
      </Box>
    );
  }

  if (!submission) return null;

  const topics = [];
  const seenTopics = new Set();
  (submission.answers || []).forEach((a) => {
    const t = a.topic || 'Sin tema';
    if (!seenTopics.has(t)) { seenTopics.add(t); topics.push(t); }
  });
  const hasTemas = topics.length > 1 || (topics.length === 1 && topics[0] !== 'Sin tema');

  let globalIdx = 0;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 4, pb: 2 }}>
        <Tooltip title="Volver a mis resultados">
          <IconButton onClick={() => navigate('/alumno/resultados')} sx={{ mt: 0.25, color: '#001f56' }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.25 }}>
            Resultado del examen
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>{submission.examTitle}</Typography>
        </Box>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, px: 3, py: 1.5, textAlign: 'center', minWidth: 100 }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>Puntaje final</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#001f56' }}>
            {submission.totalScore ?? '—'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#888' }}>/ {submission.totalPoints}</Typography>
        </Paper>
      </Box>

      {/* Fechas */}
      <Box sx={{ px: 4, pb: 2 }}>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, px: 3, py: 2, display: 'flex', gap: 4, bgcolor: '#fff', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#888' }}>Entregado</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>{formatDate(submission.submittedAt)}</Typography>
          </Box>
          {submission.gradedAt && (
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Corregido</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>{formatDate(submission.gradedAt)}</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Respuestas */}
      <Box sx={{ px: 4, pb: 2, flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
          Tus respuestas ({(submission.answers || []).length} pregunta{(submission.answers || []).length !== 1 ? 's' : ''})
        </Typography>

        {topics.map((topic) => {
          const topicAnswers = (submission.answers || []).filter((a) => (a.topic || 'Sin tema') === topic);
          const earnedInTopic = topicAnswers.reduce((s, a) => s + (a.earnedScore ?? 0), 0);
          const totalInTopic = topicAnswers.reduce((s, a) => s + (a.points || 0), 0);
          return (
            <Box key={topic}>
              {hasTemas && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: globalIdx > 0 ? 1 : 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#001f56' }}>{topic}</Typography>
                  <Divider sx={{ flex: 1 }} />
                  <Typography variant="caption" sx={{ color: '#888', flexShrink: 0 }}>
                    {earnedInTopic} / {totalInTopic} pts
                  </Typography>
                </Box>
              )}
              {topicAnswers.map((answer) => {
                const idx = globalIdx++;
                return <QuestionCard key={answer.questionId} answer={answer} index={idx} />;
              })}
            </Box>
          );
        })}

        {/* Comentario general del docente */}
        {submission.teacherFeedback && (
          <Paper elevation={0} sx={{ border: '1px solid #fff176', bgcolor: '#fffde7', borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#f57f17', mb: 1 }}>
              Comentario general del docente
            </Typography>
            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {submission.teacherFeedback}
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/alumno/resultados')}
            sx={{ textTransform: 'none', borderColor: '#001f56', color: '#001f56' }}
          >
            Volver a mis resultados
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

ResultadoDetalleContent.propTypes = {
  submissionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ResultadoDetalleContent;
