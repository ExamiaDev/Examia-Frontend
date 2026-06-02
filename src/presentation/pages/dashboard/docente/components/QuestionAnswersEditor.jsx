import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { getQuestionTypeLabel } from './examWizardUtils';
import { QuestionAnswerFields } from './questionAnswerFields';

const QuestionAnswersEditor = ({ question, index, onUpdate }) => {
  const save = (patch) => onUpdate({ ...question, ...patch });

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2.5, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
          Pregunta {index + 1} · {getQuestionTypeLabel(question.type)} · {question.puntaje} pts
        </Typography>
        <Typography sx={{ color: '#222', fontWeight: 500, mt: 0.5, lineHeight: 1.5 }}>
          {question.enunciado || '(sin enunciado)'}
        </Typography>
      </Box>
      <QuestionAnswerFields question={question} onSave={save} />
    </Paper>
  );
};

QuestionAnswersEditor.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default QuestionAnswersEditor;
