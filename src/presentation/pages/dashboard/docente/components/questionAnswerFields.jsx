import PropTypes from 'prop-types';
import { Box, Typography, TextField } from '@mui/material';
import DecisionTreeEditor from '../../../../components/DecisionTreeEditor';
import MultipleChoiceOptionsEditor from './MultipleChoiceOptionsEditor';
import MatrixTableEditor from '../../../../components/MatrixTableEditor';
import { createDefaultMatrix } from '../../../../components/matrixTableUtils';

const FreeTextModelAnswer = ({ value, onSave }) => (
  <Box>
    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
      Respuesta modelo (opcional, para referencia al corregir)
    </Typography>
    <TextField
      fullWidth
      multiline
      minRows={3}
      placeholder="Ejemplo de respuesta esperada..."
      value={value}
      onChange={(e) => onSave({ respuestaModelo: e.target.value })}
    />
  </Box>
);

FreeTextModelAnswer.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export const QuestionAnswerFields = ({ question, onSave }) => {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceOptionsEditor
          opciones={question.opciones || ['', '', '', '']}
          correcta={question.correcta ?? null}
          onSave={onSave}
        />
      );
    case 'tabla': {
      const defaults = createDefaultMatrix();
      return (
        <MatrixTableEditor
          matrixColumns={question.matrixColumns ?? defaults.matrixColumns}
          matrixRows={question.matrixRows ?? defaults.matrixRows}
          onChange={onSave}
        />
      );
    }
    case 'arbol-decision':
      return (
        <DecisionTreeEditor
          initialData={question.decisionTree}
          onChange={(treeJson) => onSave({ decisionTree: treeJson })}
        />
      );
    case 'texto-libre':
      return <FreeTextModelAnswer value={question.respuestaModelo || ''} onSave={onSave} />;
    default:
      return (
        <Typography variant="body2" sx={{ color: '#888' }}>
          Este tipo de pregunta no requiere respuesta automática.
        </Typography>
      );
  }
};

QuestionAnswerFields.propTypes = {
  question: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};
