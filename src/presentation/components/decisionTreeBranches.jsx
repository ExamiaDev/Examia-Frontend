import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  updateBranchLabel,
  addBranchToNode,
  removeBranchFromNode,
} from './decisionTreeUtils';

const QUESTION_NODE_SIZE = 132;

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
    <Box sx={{ width: 2, height: 28, bgcolor: '#94a3b8', borderRadius: 1 }} />
  </Box>
);

const TreeBranchColumn = ({
  tree,
  nodeId,
  branch,
  branchIndex,
  readOnly,
  canRemoveBranch,
  minBranches,
  onTreeChange,
  renderChildNode,
}) => {
  const patchTree = (nextTree) => onTreeChange(nextTree);

  return (
    <Box
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
              placeholder={`Opción ${branchIndex + 1}`}
              value={branch.label}
              onChange={(e) => patchTree(updateBranchLabel(tree, nodeId, branchIndex, e.target.value))}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
            />
            <Tooltip title={canRemoveBranch ? 'Eliminar esta opción y su sub-árbol' : `Mínimo ${minBranches} opciones`}>
              <span>
                <IconButton
                  size="small"
                  disabled={!canRemoveBranch}
                  onClick={() => patchTree(removeBranchFromNode(tree, nodeId, branchIndex))}
                  sx={{ color: canRemoveBranch ? '#c62828' : '#ccc' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Box>
      {renderChildNode(branch.nextId)}
    </Box>
  );
};

TreeBranchColumn.propTypes = {
  tree: PropTypes.object.isRequired,
  nodeId: PropTypes.string.isRequired,
  branch: PropTypes.object.isRequired,
  branchIndex: PropTypes.number.isRequired,
  readOnly: PropTypes.bool,
  canRemoveBranch: PropTypes.bool.isRequired,
  minBranches: PropTypes.number.isRequired,
  onTreeChange: PropTypes.func.isRequired,
  renderChildNode: PropTypes.func.isRequired,
};

export const TreeBranchesPanel = ({
  tree,
  nodeId,
  node,
  readOnly,
  onTreeChange,
  renderChildNode,
}) => {
  const isRoot = nodeId === tree.rootId;
  const minBranches = isRoot ? 2 : 1;
  const canRemoveBranch = (node.branches ?? []).length > minBranches;
  const patchTree = (nextTree) => onTreeChange(nextTree);

  return (
    <Box sx={{ width: '100%', mt: 0.5 }}>
      <HorizontalBar childCount={node.branches.length} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'nowrap', pt: 0.5 }}>
        {node.branches.map((branch, idx) => (
          <TreeBranchColumn
            key={`${nodeId}-${branch.nextId}-${idx}`}
            tree={tree}
            nodeId={nodeId}
            branch={branch}
            branchIndex={idx}
            readOnly={readOnly}
            canRemoveBranch={canRemoveBranch}
            minBranches={minBranches}
            onTreeChange={onTreeChange}
            renderChildNode={renderChildNode}
          />
        ))}
        {!readOnly && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 4 }}>
            <Tooltip title="Agregar otra opción / rama">
              <IconButton
                onClick={() => patchTree(addBranchToNode(tree, nodeId))}
                sx={{ bgcolor: '#eef2ff', border: '1px dashed #3949ab', color: '#3949ab' }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

TreeBranchesPanel.propTypes = {
  tree: PropTypes.object.isRequired,
  nodeId: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  onTreeChange: PropTypes.func.isRequired,
  renderChildNode: PropTypes.func.isRequired,
};
