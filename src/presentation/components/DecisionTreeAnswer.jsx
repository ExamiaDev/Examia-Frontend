import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  getDecisionTree,
  getNode,
  getCurrentNodeId,
  isLeafNode,
  isDecisionTreeComplete,
} from './decisionTreeUtils';

const DecisionTreeAnswer = ({
  question,
  answer,
  onChange,
  readOnly = false,
}) => {
  const tree = getDecisionTree(question);
  const path = answer?.orderAnswer ?? [];
  const currentNodeId = getCurrentNodeId(tree, path);
  const currentNode = getNode(tree, currentNodeId);
  const complete = isDecisionTreeComplete(tree, path);

  if (!tree || !currentNode) {
    return (
      <Alert severity="warning" sx={{ mt: 1.5 }}>
        Esta pregunta no tiene un árbol de decisión configurado.
      </Alert>
    );
  }

  const handleChooseBranch = (label) => {
    if (readOnly) return;
    onChange({ ...answer, orderAnswer: [...path, label] });
  };

  const handleReset = () => {
    if (readOnly) return;
    onChange({ ...answer, orderAnswer: [] });
  };

  const handleBack = () => {
    if (readOnly || path.length === 0) return;
    onChange({ ...answer, orderAnswer: path.slice(0, -1) });
  };

  const showResultFeedback = readOnly;

  return (
    <Box sx={{ mt: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <AccountTreeIcon sx={{ color: '#001f56', fontSize: 20 }} />
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Árbol de decisión
        </Typography>
      </Box>

      {path.length > 0 && (
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          {path.map((step, idx) => (
            <Chip
              key={`${step}-${idx}`}
              label={step}
              size="small"
              sx={{ bgcolor: '#eef2ff', color: '#001f56', fontWeight: 600 }}
            />
          ))}
        </Stack>
      )}

      <Paper
        elevation={0}
        sx={{
          border: '2px solid #001f56',
          borderRadius: isLeafNode(currentNode) ? 2 : '50%',
          width: isLeafNode(currentNode) ? '100%' : 140,
          maxWidth: isLeafNode(currentNode) ? '100%' : 140,
          minHeight: isLeafNode(currentNode) ? 'auto' : 140,
          mx: isLeafNode(currentNode) ? 0 : 'auto',
          p: 2.5,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, display: 'block', mb: 0.75 }}>
          {complete ? 'Conclusión' : 'Pregunta actual'}
        </Typography>
        <Typography
          sx={{
            color: '#222',
            fontWeight: complete ? 600 : 500,
            lineHeight: 1.5,
            textAlign: isLeafNode(currentNode) ? 'left' : 'center',
            fontSize: isLeafNode(currentNode) ? 'inherit' : '0.875rem',
          }}
        >
          {currentNode.text || '(sin texto)'}
        </Typography>
      </Paper>

      {!readOnly && !complete && currentNode.branches?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
            Elegí una opción para continuar:
          </Typography>
          <Stack spacing={1}>
            {currentNode.branches.map((branch) => {
              const nextNode = getNode(tree, branch.nextId);
              const leadsToLeaf = nextNode && isLeafNode(nextNode);
              return (
                <Button
                  key={`${branch.label}-${branch.nextId}`}
                  variant="outlined"
                  onClick={() => handleChooseBranch(branch.label)}
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    borderColor: '#cbd5e1',
                    color: '#001f56',
                    py: 1.2,
                    px: 2,
                    '&:hover': { borderColor: '#001f56', bgcolor: 'rgba(0,31,86,0.04)' },
                  }}
                >
                  <span>{branch.label}</span>
                  <Typography component="span" variant="caption" sx={{ color: '#888', ml: 2 }}>
                    {leadsToLeaf ? '→ Resultado' : '→ Siguiente paso'}
                  </Typography>
                </Button>
              );
            })}
          </Stack>
        </Box>
      )}

      {complete && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {readOnly
            ? 'Recorrido del alumno por el árbol.'
            : 'Llegaste a una conclusión. Podés reiniciar si querés cambiar tu camino.'}
        </Alert>
      )}

      {!readOnly && (path.length > 0 || complete) && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Reiniciar
          </Button>
          {path.length > 0 && !complete && (
            <Button size="small" onClick={handleBack} sx={{ textTransform: 'none', color: '#666' }}>
              Volver atrás
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};

DecisionTreeAnswer.propTypes = {
  question: PropTypes.shape({
    decisionTree: PropTypes.shape({
      rootId: PropTypes.string,
      nodes: PropTypes.object,
    }),
    correctOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  answer: PropTypes.shape({
    orderAnswer: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default DecisionTreeAnswer;
