import PropTypes from 'prop-types';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';

const ReadOnlyTeacherFeedback = ({ feedback }) => (
  <Box sx={{ bgcolor: '#fffde7', borderRadius: 1, px: 2, py: 1.5, border: '1px solid #fff176' }}>
    <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 600, display: 'block', mb: 0.5 }}>
      Comentario del docente
    </Typography>
    <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {feedback}
    </Typography>
  </Box>
);

ReadOnlyTeacherFeedback.propTypes = {
  feedback: PropTypes.string.isRequired,
};

const EditableGradingFields = ({ answer, scoreValue, feedbackValue, onScoreChange, onFeedbackChange }) => {
  const parsed = Number.parseFloat(scoreValue);
  const scoreInvalid =
    scoreValue !== '' &&
    (Number.isNaN(parsed) || parsed < 0 || parsed > answer.points);

  const handleScoreChange = (e) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') {
      onScoreChange(answer.questionId, raw);
      return;
    }
    const num = Number.parseFloat(raw);
    if (Number.isNaN(num)) return;
    const clamped = Math.min(num, answer.points);
    onScoreChange(answer.questionId, String(clamped));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <TextField
        label="Puntaje"
        type="number"
        size="small"
        value={scoreValue}
        onChange={handleScoreChange}
        error={scoreInvalid}
        helperText={scoreInvalid ? `Entre 0 y ${answer.points}` : `Máx. ${answer.points}`}
        slotProps={{
          htmlInput: { min: 0, max: answer.points, step: 0.1 },
          input: { endAdornment: <InputAdornment position="end">pts</InputAdornment> },
        }}
        sx={{ width: 140 }}
      />
      <TextField
        label="Comentario (opcional)"
        size="small"
        value={feedbackValue}
        onChange={(e) => onFeedbackChange(answer.questionId, e.target.value)}
        placeholder="Feedback para el alumno..."
        multiline
        minRows={1}
        sx={{ flex: 1, minWidth: 200 }}
      />
    </Box>
  );
};

EditableGradingFields.propTypes = {
  answer: PropTypes.object.isRequired,
  scoreValue: PropTypes.string,
  feedbackValue: PropTypes.string,
  onScoreChange: PropTypes.func.isRequired,
  onFeedbackChange: PropTypes.func.isRequired,
};

const CorrectionQuestionFooter = ({ answer, readOnly, scoreValue, feedbackValue, onScoreChange, onFeedbackChange }) => {
  if (readOnly) {
    if (!answer.teacherFeedback) return null;
    return <ReadOnlyTeacherFeedback feedback={answer.teacherFeedback} />;
  }

  return (
    <EditableGradingFields
      answer={answer}
      scoreValue={scoreValue}
      feedbackValue={feedbackValue}
      onScoreChange={onScoreChange}
      onFeedbackChange={onFeedbackChange}
    />
  );
};

CorrectionQuestionFooter.propTypes = {
  answer: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  scoreValue: PropTypes.string,
  feedbackValue: PropTypes.string,
  onScoreChange: PropTypes.func.isRequired,
  onFeedbackChange: PropTypes.func.isRequired,
};

export default CorrectionQuestionFooter;
