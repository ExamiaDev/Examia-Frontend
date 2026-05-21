import { TextField } from '@mui/material';

const CustomTextField = ({ ...props }) => {
  const { size = 'small' } = props;

  return (
    <TextField
      fullWidth
      variant="outlined"
      size={size}
      {...props}
    />
  );
};

export default CustomTextField;
