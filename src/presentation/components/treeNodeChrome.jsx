import PropTypes from 'prop-types';
import { Box, Typography, Paper, Stack } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';

const NODE_WIDTH = 220;
const QUESTION_NODE_SIZE = 132;

export const TreeNodeChrome = ({ presentation, children }) => {
  const { isQuestionNode, nodeKind, displayNum, nodeColor } = presentation;

  if (isQuestionNode) {
    return (
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
        <Box sx={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center' }}>{children}</Box>
      </Box>
    );
  }

  return (
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
      <Box sx={{ p: 1.5 }}>{children}</Box>
    </Paper>
  );
};

TreeNodeChrome.propTypes = {
  presentation: PropTypes.shape({
    isQuestionNode: PropTypes.bool.isRequired,
    nodeKind: PropTypes.string.isRequired,
    displayNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nodeColor: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};
