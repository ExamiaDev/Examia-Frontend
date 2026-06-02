import PropTypes from 'prop-types';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { removeOpcion, updateOpcionText } from './questionAnswersHelpers';

const MultipleChoiceOptionsEditor = ({ opciones, correcta, onSave }) => (
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
              onClick={() => onSave({ correcta: correcta === i ? null : i })}
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
              onChange={(e) => onSave({ opciones: updateOpcionText(opciones, i, e.target.value) })}
            />
            {opciones.length > 2 && (
              <IconButton
                size="small"
                onClick={() => onSave(removeOpcion(opciones, correcta, i))}
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
      onClick={() => onSave({ opciones: [...opciones, ''] })}
      sx={{ mt: 1.5, textTransform: 'none', color: '#001f56' }}
    >
      Agregar opción
    </Button>
  </Box>
);

MultipleChoiceOptionsEditor.propTypes = {
  opciones: PropTypes.arrayOf(PropTypes.string).isRequired,
  correcta: PropTypes.number,
  onSave: PropTypes.func.isRequired,
};

export default MultipleChoiceOptionsEditor;
