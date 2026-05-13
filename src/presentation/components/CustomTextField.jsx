/**
 * Custom TextField Component
 */

import { TextField } from '@mui/material';

const CustomTextField = (props) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="normal"
      {...props}
    />
  );
};

export default CustomTextField;

