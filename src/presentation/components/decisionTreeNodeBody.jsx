import { Typography, TextField } from '@mui/material';
import { updateNodeText } from './decisionTreeUtils';

export const renderNodeBody = (tree, nodeId, node, readOnly, isQuestionNode, onTreeChange) => {
  const patchTree = (nextTree) => onTreeChange(nextTree);

  if (readOnly) {
    return (
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
    );
  }

  return (
    <TextField
      fullWidth
      size="small"
      multiline
      minRows={2}
      placeholder={isQuestionNode ? 'Pregunta...' : 'Texto del resultado final...'}
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
};
