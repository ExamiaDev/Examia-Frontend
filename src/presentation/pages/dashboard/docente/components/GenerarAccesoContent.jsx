import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
} from '@mui/material';
import ExamService from '../../../../../application/services/ExamService';
import httpClient from '../../../../../infrastructure/http/httpClient';
import ExamWizardShell from './ExamWizardShell';
import { examToWizardState } from './examWizardUtils';

const GenerarAccesoContent = ({ examId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [examInfo, setExamInfo] = useState(null);
  const [published, setPublished] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const showMessage = (severity, message) => setSnackbar({ open: true, severity, message });

  useEffect(() => {
    if (!examId) {
      setLoadError('No se encontró el ID del examen');
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const exam = await ExamService.getExamById(examId);
        const state = examToWizardState(exam);
        setExamInfo(state);
        setPublished(state.published);
      } catch (error) {
        setLoadError(error.message || 'No se pudo cargar el examen');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId]);

  const handleContinue = async () => {
    setContinuing(true);
    try {
      await httpClient.patch(`/exams/${examId}/publish`, { published });
      showMessage('success', published ? 'Examen publicado correctamente' : 'Examen guardado como borrador');
      setTimeout(() => navigate('/docente/examenes'), 600);
    } catch (error) {
      showMessage('error', error.response?.data?.message || error.message || 'No se pudo finalizar');
    } finally {
      setContinuing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#001f56' }} />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{loadError}</Alert>
      </Box>
    );
  }

  const totalPreguntas = examInfo?.temas?.reduce((acc, t) => acc + t.preguntas.length, 0) ?? 0;

  return (
    <ExamWizardShell
      activeStep={2}
      title="Crear acceso"
      subtitle="Publicá el examen para que los alumnos puedan rendirlo, o dejalo en borrador."
      onContinue={handleContinue}
      continuing={continuing}
      continueLabel="Finalizar"
      showSaveDraft={false}
      snackbar={snackbar}
      onCloseSnackbar={() => setSnackbar((s) => ({ ...s, open: false }))}
    >
      <Box sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#001f56', fontWeight: 700, mb: 1 }}>
            {examInfo?.formData?.nombre}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`${totalPreguntas} preguntas`} size="small" />
            <Chip label={`${examInfo?.temas?.length ?? 0} temas`} size="small" />
            <Chip
              label={published ? 'Se publicará al finalizar' : 'Quedará en borrador'}
              size="small"
              sx={{ bgcolor: published ? '#e8f5e9' : '#f5f5f5', color: published ? '#2e7d32' : '#666' }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#001f56' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#001f56' },
                }}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#222' }}>Publicar examen</Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {published
                    ? 'Los alumnos podrán ver y rendir este examen.'
                    : 'El examen quedará visible solo para vos hasta que lo publiques.'}
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', ml: 0 }}
          />
        </Paper>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Al finalizar volverás al listado de exámenes. Podés cambiar el estado de publicación en cualquier momento desde ahí.
        </Typography>
      </Box>
    </ExamWizardShell>
  );
};

export default GenerarAccesoContent;

GenerarAccesoContent.propTypes = {
  examId: PropTypes.string.isRequired,
};
