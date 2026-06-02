import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FlagIcon from '@mui/icons-material/Flag';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import {
  createDefaultDecisionTree,
  getNode,
  isLeafNode,
  getNodeDisplayNumbers,
  updateNodeText,
  updateBranchLabel,
  addBranchToNode,
  removeBranchFromNode,
  extendLeafNode,
} from './decisionTreeUtils';

const NODE_WIDTH = 220;
const QUESTION_NODE_SIZE = 132;

const EdgeConnector = () => (
  <Box
    sx={{
      width: 2,
      height: 28,
      bgcolor: '#94a3b8',
      borderRadius: 1,
    }}
  />
);

const HorizontalBar = ({ childCount }) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: 24,
      display: 'flex',
      justifyContent: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: childCount > 1 ? `calc(100% / ${childCount * 2})` : '50%',
        right: childCount > 1 ? `calc(100% / ${childCount * 2})` : '50%',
        height: 2,
        bgcolor: '#94a3b8',
        transform: childCount > 1 ? 'none' : 'translateX(-50%)',
        width: childCount > 1 ? 'auto' : 2,
      },
    }}
  >
    <EdgeConnector />
  </Box>
);

const TreeNodeView = ({
  tree,
  nodeId,
  displayNumbers,
  onTreeChange,
  readOnly,
}) => {
  const node = getNode(tree, nodeId);
  if (!node) return null;

  const isRoot = nodeId === tree.rootId;
  const isLeaf = isLeafNode(node);
  const isQuestionNode = !isLeaf;
  const displayNum = displayNumbers[nodeId] ?? '?';
  const minBranches = isRoot ? 2 : 1;
  const canRemoveBranch = (node.branches ?? []).length > minBranches;

  const nodeKind = isRoot ? 'Inicio' : isLeaf ? 'Resultado' : 'Pregunta';
  const nodeColor = isRoot ? '#001f56' : isLeaf ? '#2e7d32' : '#3949ab';

  const patchTree = (nextTree) => onTreeChange(nextTree);

  const nodeBody = readOnly ? (
    <Typography
      variant="body2"
      sx={{
        textAlign: 'center',
        color: '#222',
        fontSize: isQuestionNode ? '0.8rem' : '0.875rem',
        lineHeight: 1.35,
        px: isQuestionNode ? 1 : 0,
        wordBreak: 'break-word',
      }}
    >
      {node.text || '(sin texto)'}
    </Typography>
  ) : (
    <TextField
      fullWidth
      size="small"
      multiline={!isQuestionNode}
      minRows={isQuestionNode ? 2 : 2}
      placeholder={isLeaf ? 'Texto del resultado final...' : 'Pregunta...'}
      value={node.text ?? ''}
      onChange={(e) => patchTree(updateNodeText(tree, nodeId, e.target.value))}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: '#fff',
          fontSize: isQuestionNode ? '0.8rem' : '0.875rem',
        },
        '& .MuiOutlinedInput-input': { textAlign: isQuestionNode ? 'center' : 'left' },
      }}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: isQuestionNode ? QUESTION_NODE_SIZE : NODE_WIDTH }}>
      {isQuestionNode ? (
        <Box
          sx={{
            width: QUESTION_NODE_SIZE,
            height: QUESTION_NODE_SIZE,
            borderRadius: '50%',
            border: '3px solid',
            borderColor: nodeColor,
            bgcolor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,31,86,0.12)',
            p: 1,
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
            <HelpOutlineIcon sx={{ fontSize: 13, color: nodeColor }} />
            <Typography variant="caption" sx={{ color: nodeColor, fontWeight: 700, fontSize: '0.65rem' }}>
              {nodeKind} {displayNum}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center' }}>
            {nodeBody}
          </Box>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: NODE_WIDTH,
            border: '2px solid',
            borderColor: nodeColor,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ bgcolor: nodeColor, px: 1.5, py: 0.75, display: 'flex', alignItems: 'center' }}>
            <FlagIcon sx={{ fontSize: 14, color: '#fff', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
              {nodeKind} {displayNum}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5 }}>{nodeBody}</Box>
        </Paper>
      )}

      {isLeaf && !readOnly && (
        <Tooltip title="Convertir este resultado en una nueva decisión con ramas">
          <IconButton
            size="small"
            onClick={() => patchTree(extendLeafNode(tree, nodeId))}
            sx={{
              mt: 1,
              bgcolor: '#eef2ff',
              border: '1px dashed #3949ab',
              color: '#3949ab',
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {!isLeaf && (
        <Box sx={{ width: '100%', mt: 0.5 }}>
          <HorizontalBar childCount={node.branches.length} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'nowrap',
              pt: 0.5,
            }}
          >
            {node.branches.map((branch, idx) => (
              <Box
                key={`${nodeId}-${branch.nextId}-${idx}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: QUESTION_NODE_SIZE,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', mb: 0.5 }}>
                  {readOnly ? (
                    <Chip label={branch.label} size="small" sx={{ bgcolor: '#eef2ff', color: '#001f56', fontWeight: 600 }} />
                  ) : (
                    <>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={`Opción ${idx + 1}`}
                        value={branch.label}
                        onChange={(e) => patchTree(updateBranchLabel(tree, nodeId, idx, e.target.value))}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
                      />
                      <Tooltip title={canRemoveBranch ? 'Eliminar esta opción y su sub-árbol' : `Mínimo ${minBranches} opciones`}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={!canRemoveBranch}
                            onClick={() => patchTree(removeBranchFromNode(tree, nodeId, idx))}
                            sx={{ color: canRemoveBranch ? '#c62828' : '#ccc' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </>
                  )}
                </Box>
                <TreeNodeView
                  tree={tree}
                  nodeId={branch.nextId}
                  displayNumbers={displayNumbers}
                  onTreeChange={onTreeChange}
                  readOnly={readOnly}
                />
              </Box>
            ))}

            {!readOnly && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 4 }}>
                <Tooltip title="Agregar otra opción / rama">
                  <IconButton
                    onClick={() => patchTree(addBranchToNode(tree, nodeId))}
                    sx={{
                      bgcolor: '#eef2ff',
                      border: '1px dashed #3949ab',
                      color: '#3949ab',
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption" sx={{ color: '#666', mt: 0.5, textAlign: 'center', maxWidth: 80 }}>
                  Nueva opción
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

TreeNodeView.propTypes = {
  tree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }).isRequired,
  nodeId: PropTypes.string.isRequired,
  displayNumbers: PropTypes.object.isRequired,
  onTreeChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

const DecisionTreeEditor = ({ tree, onChange, readOnly = false }) => {
  const data = tree ?? createDefaultDecisionTree();
  const displayNumbers = useMemo(() => getNodeDisplayNumbers(data), [data]);

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.5 }}>
        <AccountTreeIcon sx={{ color: '#001f56' }} />
        <Typography variant="caption" sx={{ color: '#555', fontWeight: 600 }}>
          {readOnly
            ? 'Árbol de referencia (respuesta del docente).'
            : 'El árbol completo es la respuesta. Los nodos redondos son las preguntas.'}
        </Typography>
        <Chip label="Pregunta" size="small" sx={{ bgcolor: '#3949ab', color: '#fff', height: 22, borderRadius: '12px' }} />
        <Chip label="Resultado" size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', height: 22 }} />
      </Stack>

      {!readOnly && (
        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 2 }}>
          Usá <strong>+</strong> en una hoja para agregar más pasos, o <strong>+ Nueva opción</strong> para ramificar.
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: '#f8fafc',
          overflowX: 'auto',
        }}
      >
        <Box sx={{ display: 'inline-flex', minWidth: '100%', justifyContent: 'center', py: 1 }}>
          <TreeNodeView
            tree={data}
            nodeId={data.rootId}
            displayNumbers={displayNumbers}
            onTreeChange={onChange}
            readOnly={readOnly}
          />
        </Box>
      </Paper>
    </Box>
  );
};

DecisionTreeEditor.propTypes = {
  tree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

export default DecisionTreeEditor;
