import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
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
  getAllTreePaths,
  formatDecisionPath,
  getNode,
  isLeafNode,
  getNodeDisplayNumbers,
  updateNodeText,
  updateBranchLabel,
  addBranchToNode,
  removeBranchFromNode,
  extendLeafNode,
  sanitizeCorrectPath,
} from './decisionTreeUtils';

const NODE_WIDTH = 220;

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
  correctPath,
}) => {
  const node = getNode(tree, nodeId);
  if (!node) return null;

  const isRoot = nodeId === tree.rootId;
  const isLeaf = isLeafNode(node);
  const displayNum = displayNumbers[nodeId] ?? '?';
  const minBranches = isRoot ? 2 : 1;
  const canRemoveBranch = (node.branches ?? []).length > minBranches;

  const nodeKind = isRoot ? 'Inicio' : isLeaf ? 'Resultado' : 'Decisión';
  const nodeColor = isRoot ? '#001f56' : isLeaf ? '#2e7d32' : '#3949ab';

  const patchTree = (nextTree) => {
    onTreeChange(nextTree, sanitizeCorrectPath(nextTree, correctPath));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: NODE_WIDTH }}>
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
        <Box sx={{ bgcolor: nodeColor, px: 1.5, py: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            {isLeaf ? (
              <FlagIcon sx={{ fontSize: 14, color: '#fff' }} />
            ) : (
              <HelpOutlineIcon sx={{ fontSize: 14, color: '#fff' }} />
            )}
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
              {nodeKind} {displayNum}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={isLeaf ? 2 : 1}
            placeholder={isLeaf ? 'Texto del resultado final...' : 'Pregunta o decisión...'}
            value={node.text ?? ''}
            onChange={(e) => patchTree(updateNodeText(tree, nodeId, e.target.value))}
          />
        </Box>
      </Paper>

      {isLeaf && (
        <Tooltip title="Convertir este resultado en una nueva decisión con ramas">
          <IconButton
            size="small"
            onClick={() => patchTree(extendLeafNode(tree, nodeId))}
            sx={{
              mt: 1,
              bgcolor: '#eef2ff',
              border: '1px dashed #3949ab',
              color: '#3949ab',
              '&:hover': { bgcolor: '#e0e7ff' },
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
                  minWidth: NODE_WIDTH,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', mb: 0.5 }}>
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
                </Box>
                <TreeNodeView
                  tree={tree}
                  nodeId={branch.nextId}
                  displayNumbers={displayNumbers}
                  onTreeChange={onTreeChange}
                  correctPath={correctPath}
                />
              </Box>
            ))}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 4 }}>
              <Tooltip title="Agregar otra opción / rama">
                <IconButton
                  onClick={() => patchTree(addBranchToNode(tree, nodeId))}
                  sx={{
                    bgcolor: '#eef2ff',
                    border: '1px dashed #3949ab',
                    color: '#3949ab',
                    '&:hover': { bgcolor: '#e0e7ff' },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" sx={{ color: '#666', mt: 0.5, textAlign: 'center', maxWidth: 80 }}>
                Nueva opción
              </Typography>
            </Box>
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
  correctPath: PropTypes.arrayOf(PropTypes.string),
};

const DecisionTreeEditor = ({ tree, correctPath = [], onChange }) => {
  const data = tree ?? createDefaultDecisionTree();
  const allPaths = getAllTreePaths(data);
  const displayNumbers = useMemo(() => getNodeDisplayNumbers(data), [data]);

  const handleTreeChange = (nextTree, nextCorrectPath = correctPath) => {
    onChange(nextTree, nextCorrectPath);
  };

  const handleCorrectPathChange = (pathIndex) => {
    const selected = allPaths[pathIndex];
    if (selected) onChange(data, selected);
  };

  const selectedPathIndex = allPaths.findIndex((p) =>
    p.length === correctPath.length && p.every((step, i) => step === correctPath[i]));

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.5 }}>
        <AccountTreeIcon sx={{ color: '#001f56' }} />
        <Typography variant="caption" sx={{ color: '#555', fontWeight: 600 }}>
          Armá el árbol visualmente: cada caja es un paso, las ramas son las opciones del alumno.
        </Typography>
        <Chip label="Inicio" size="small" sx={{ bgcolor: '#001f56', color: '#fff', height: 22 }} />
        <Chip label="Decisión" size="small" sx={{ bgcolor: '#3949ab', color: '#fff', height: 22 }} />
        <Chip label="Resultado" size="small" sx={{ bgcolor: '#2e7d32', color: '#fff', height: 22 }} />
      </Stack>

      <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 2 }}>
        Usá <strong>+</strong> en una hoja para agregar más pasos, o <strong>+ Nueva opción</strong> para ramificar. El ícono de papelera elimina una rama.
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: '#f8fafc',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Box sx={{ display: 'inline-flex', minWidth: '100%', justifyContent: 'center', py: 1 }}>
          <TreeNodeView
            tree={data}
            nodeId={data.rootId}
            displayNumbers={displayNumbers}
            onTreeChange={handleTreeChange}
            correctPath={correctPath}
          />
        </Box>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <FormControl fullWidth size="small">
        <InputLabel>Camino correcto</InputLabel>
        <Select
          label="Camino correcto"
          value={selectedPathIndex >= 0 ? selectedPathIndex : ''}
          onChange={(e) => handleCorrectPathChange(Number(e.target.value))}
        >
          {allPaths.map((path, idx) => (
            <MenuItem key={formatDecisionPath(path)} value={idx}>
              {formatDecisionPath(path)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
        El alumno navegará el árbol eligiendo opciones hasta llegar a un resultado final.
      </Typography>
    </Box>
  );
};

DecisionTreeEditor.propTypes = {
  tree: PropTypes.shape({
    rootId: PropTypes.string,
    nodes: PropTypes.object,
  }),
  correctPath: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

export default DecisionTreeEditor;
