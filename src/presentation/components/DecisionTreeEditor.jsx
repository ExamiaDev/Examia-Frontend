import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
  createDefaultDecisionTree,
  getNode,
  extendLeafNode,
  getNodeDisplayNumbers,
} from './decisionTreeUtils';
import { renderNodeBody } from './decisionTreeNodeBody';
import { TreeBranchesPanel } from './decisionTreeBranches';
import { getTreeNodePresentation, TREE_NODE_LAYOUT_WIDTH } from './decisionTreePresentation';
import { TreeNodeChrome } from './treeNodeChrome';

const ExtendLeafButton = ({ onExtend }) => (
  <Tooltip title="Convertir este resultado en una nueva decisión con ramas">
    <IconButton
      size="small"
      onClick={onExtend}
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
);

ExtendLeafButton.propTypes = {
  onExtend: PropTypes.func.isRequired,
};

const TreeNodeView = ({
  tree,
  nodeId,
  displayNumbers,
  onTreeChange,
  readOnly,
}) => {
  const node = getNode(tree, nodeId);
  if (!node) return null;

  const presentation = getTreeNodePresentation(tree, nodeId, node, displayNumbers);
  const { isLeaf, isQuestionNode } = presentation;
  const minWidth = isQuestionNode ? TREE_NODE_LAYOUT_WIDTH.question : TREE_NODE_LAYOUT_WIDTH.result;
  const nodeBody = renderNodeBody(tree, nodeId, node, readOnly, isQuestionNode, onTreeChange);

  const renderChildNode = (childId) => (
    <TreeNodeView
      tree={tree}
      nodeId={childId}
      displayNumbers={displayNumbers}
      onTreeChange={onTreeChange}
      readOnly={readOnly}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth }}>
      <TreeNodeChrome presentation={presentation}>{nodeBody}</TreeNodeChrome>

      {isLeaf && !readOnly && (
        <ExtendLeafButton onExtend={() => onTreeChange(extendLeafNode(tree, nodeId))} />
      )}

      {!isLeaf && (
        <TreeBranchesPanel
          tree={tree}
          nodeId={nodeId}
          node={node}
          readOnly={readOnly}
          onTreeChange={onTreeChange}
          renderChildNode={renderChildNode}
        />
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
