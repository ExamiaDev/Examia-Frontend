import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { WIZARD_STEPS } from './examWizardUtils';

const STEP_ICON_SLOT_PROPS = {
  stepIcon: {
    sx: {
      '&.Mui-active': { color: '#001f56' },
      '&.Mui-completed': { color: '#001f56' },
    },
  },
};

const ExamWizardShell = ({
  activeStep,
  title,
  subtitle,
  children,
  onSaveDraft,
  onContinue,
  savingDraft = false,
  continuing = false,
  saveLabel = 'Guardar borrador',
  continueLabel = 'Continuar',
  showSaveDraft = true,
  snackbar,
  onCloseSnackbar,
}) => (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 4, pb: 2 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>{subtitle}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {showSaveDraft && onSaveDraft && (
          <Button
            variant="outlined"
            startIcon={savingDraft ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={onSaveDraft}
            disabled={savingDraft || continuing}
            sx={{
              borderColor: '#001f56',
              color: '#001f56',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
            }}
          >
            {savingDraft ? 'Guardando...' : saveLabel}
          </Button>
        )}
        {onContinue && (
          <Button
            variant="contained"
            endIcon={continuing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ArrowForwardIcon />}
            onClick={onContinue}
            disabled={savingDraft || continuing}
            sx={{ bgcolor: '#001f56', textTransform: 'none', fontWeight: 500, px: 3, '&:hover': { bgcolor: '#002a75' } }}
          >
            {continuing ? 'Procesando...' : continueLabel}
          </Button>
        )}
      </Box>
    </Box>

    <Box sx={{ px: 4, pb: 4, flex: 1 }}>
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {WIZARD_STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel slotProps={STEP_ICON_SLOT_PROPS}>
                  <Typography
                    sx={{
                      color: index === activeStep ? '#001f56' : '#666',
                      fontWeight: index === activeStep ? 600 : 400,
                      fontSize: '0.875rem',
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {children}
      </Paper>
    </Box>

    <Snackbar
      open={snackbar?.open}
      autoHideDuration={4000}
      onClose={onCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onCloseSnackbar} severity={snackbar?.severity || 'success'} variant="filled" sx={{ width: '100%' }}>
        {snackbar?.message}
      </Alert>
    </Snackbar>
  </Box>
);

ExamWizardShell.propTypes = {
  activeStep: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSaveDraft: PropTypes.func,
  onContinue: PropTypes.func,
  savingDraft: PropTypes.bool,
  continuing: PropTypes.bool,
  saveLabel: PropTypes.string,
  continueLabel: PropTypes.string,
  showSaveDraft: PropTypes.bool,
  snackbar: PropTypes.shape({
    open: PropTypes.bool,
    severity: PropTypes.string,
    message: PropTypes.string,
  }),
  onCloseSnackbar: PropTypes.func,
};

export default ExamWizardShell;
