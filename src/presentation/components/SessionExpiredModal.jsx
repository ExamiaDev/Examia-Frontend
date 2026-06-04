import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';

export default function SessionExpiredModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      PaperProps={{
        sx: { borderRadius: 2, minWidth: 340, textAlign: 'center', p: 1 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pt: 1 }}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          Sesión expirada
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tu sesión ha expirado. Por favor, volvé a iniciar sesión para continuar.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary" size="large">
          Volver al login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
