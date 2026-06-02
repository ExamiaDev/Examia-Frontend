import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import QuestionAnswersEditor from './QuestionAnswersEditor';

const TemaAnswersSection = ({ tema, temaIndex, onUpdateQuestion }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle2" sx={{ color: '#001f56', fontWeight: 700, mb: 1.5 }}>
      {tema.nombre}
    </Typography>
    {tema.preguntas.map((question, index) => (
      <QuestionAnswersEditor
        key={question.id}
        question={question}
        index={index}
        onUpdate={(updated) => onUpdateQuestion(temaIndex, question.id, updated)}
      />
    ))}
  </Box>
);

TemaAnswersSection.propTypes = {
  tema: PropTypes.object.isRequired,
  temaIndex: PropTypes.number.isRequired,
  onUpdateQuestion: PropTypes.func.isRequired,
};

export default TemaAnswersSection;
