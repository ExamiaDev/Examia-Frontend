import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DecisionTreeEditor from '../../../../components/DecisionTreeEditor';
import MatrixTableEditor from '../../../../components/MatrixTableEditor';
import { createDefaultDecisionTree } from '../../../../components/decisionTreeUtils';
import { createDefaultMatrix } from '../../../../components/matrixTableUtils';
import { getQuestionTypeLabel } from './examWizardUtils';

const QuestionAnswersEditor = ({ question, index, onUpdate }) => {
  const save = (patch) => onUpdate({ ...question, ...patch });

  const renderAnswers = () => {
    switch (question.type) {
      case 'multiple-choice': {
        const opciones = question.opciones || ['', '', '', ''];
        const correcta = question.correcta ?? null;

        return (
          <Box>
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1.5 }}>
              Opciones y respuesta correcta
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {opciones.map((opcion, i) => {
                const isCorrect = correcta === i;
                return (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      onClick={() => save({ correcta: correcta === i ? null : i })}
                      title={isCorrect ? 'Desmarcar como correcta' : 'Marcar como correcta'}
                      sx={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: isCorrect ? '2px solid #2e7d32' : '2px solid #bbb',
                        bgcolor: isCorrect ? '#2e7d32' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: isCorrect ? '#fff' : '#888',
                        cursor: 'pointer',
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                      value={opcion}
                      onChange={(e) => {
                        const next = [...opciones];
                        next[i] = e.target.value;
                        save({ opciones: next });
                      }}
                    />
                    {opciones.length > 2 && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const next = opciones.filter((_, idx) => idx !== i);
                          const nextCorrecta = correcta === i ? null : correcta > i ? correcta - 1 : correcta;
                          save({ opciones: next, correcta: nextCorrecta });
                        }}
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
              onClick={() => save({ opciones: [...opciones, ''] })}
              sx={{ mt: 1.5, textTransform: 'none', color: '#001f56' }}
            >
              Agregar opción
            </Button>
          </Box>
        );
      }

      case 'tabla': {
        const matrix = {
          matrixColumns: question.matrixColumns ?? createDefaultMatrix().matrixColumns,
          matrixRows: question.matrixRows ?? createDefaultMatrix().matrixRows,
        };
        return (
          <MatrixTableEditor
            matrixColumns={matrix.matrixColumns}
            matrixRows={matrix.matrixRows}
            onChange={(next) => save(next)}
          />
        );
      }

      case 'arbol-decision':
        return (
          <DecisionTreeEditor
            tree={question.decisionTree ?? createDefaultDecisionTree()}
            onChange={(nextTree) => save({ decisionTree: nextTree })}
          />
        );

      case 'texto-libre':
        return (
          <Box>
            <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
              Respuesta modelo (opcional, para referencia al corregir)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Ejemplo de respuesta esperada..."
              value={question.respuestaModelo || ''}
              onChange={(e) => save({ respuestaModelo: e.target.value })}
            />
          </Box>
        );

      default:
        return (
          <Typography variant="body2" sx={{ color: '#888' }}>
            Este tipo de pregunta no requiere respuesta automática.
          </Typography>
        );
    }
  };

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
      {renderAnswers()}
    </Paper>
  );
};

QuestionAnswersEditor.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default QuestionAnswersEditor;
