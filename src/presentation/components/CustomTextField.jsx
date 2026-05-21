import PropTypes from 'prop-types';
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

CustomTextField.propTypes = {
  size: PropTypes.oneOf(['small', 'medium']),
};

CustomTextField.defaultProps = {
  size: 'small',
};

export default CustomTextField;
