import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ExamService from '../../../../../application/services/ExamService';
import ExamWizardShell from './ExamWizardShell';
import QuestionAnswersEditor from './QuestionAnswersEditor';
import {
  buildExamPayload,
  examToWizardState,
  validateExamMetadata,
  validateStepAnswers,
} from './examWizardUtils';

const CargarRespuestasContent = ({ examId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formData, setFormData] = useState({ nombre: '', curso: '', turno: '', periodo: '2026 - 1°c' });
  const [temas, setTemas] = useState([]);
  const [savingDraft, setSavingDraft] = useState(false);
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
        setFormData(state.formData);
        setTemas(state.temas);
      } catch (error) {
        setLoadError(error.message || 'No se pudo cargar el examen');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId]);

  const handleUpdateQuestion = useCallback((temaIndex, questionId, updated) => {
    setTemas((prev) => prev.map((tema, idx) => (
      idx === temaIndex
        ? { ...tema, preguntas: tema.preguntas.map((q) => (q.id === questionId ? updated : q)) }
        : tema
    )));
  }, []);

  const persistExam = async () => {
    const payload = buildExamPayload(formData, temas, { includeAnswers: true });
    return ExamService.updateExam(examId, payload);
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await persistExam();
      showMessage('success', 'Respuestas guardadas correctamente');
    } catch (error) {
      showMessage('error', error.message || 'No se pudo guardar');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleContinue = async () => {
    const metaError = validateExamMetadata(formData);
    if (metaError) return showMessage('error', metaError);

    const answersError = validateStepAnswers(temas);
    if (answersError) return showMessage('error', answersError);

    setContinuing(true);
    try {
      await persistExam();
      showMessage('success', 'Respuestas guardadas, pasando al siguiente paso...');
      setTimeout(() => navigate(`/docente/examenes/${examId}/acceso`), 600);
    } catch (error) {
      showMessage('error', error.message || 'No se pudo continuar');
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

  return (
    <ExamWizardShell
      activeStep={1}
      title="Cargar respuestas"
      subtitle="Configurá las respuestas correctas para cada pregunta del examen."
      onSaveDraft={handleSaveDraft}
      onContinue={handleContinue}
      savingDraft={savingDraft}
      continuing={continuing}
      saveLabel="Guardar respuestas"
      snackbar={snackbar}
      onCloseSnackbar={() => setSnackbar((s) => ({ ...s, open: false }))}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Examen: <strong>{formData.nombre}</strong>
        </Typography>

        {temas.map((tema, temaIndex) => (
          <Box key={tema.id} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#001f56', fontWeight: 700, mb: 1.5 }}>
              {tema.nombre}
            </Typography>
            {tema.preguntas.map((question, index) => (
              <QuestionAnswersEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updated) => handleUpdateQuestion(temaIndex, question.id, updated)}
              />
            ))}
          </Box>
        ))}
      </Box>
    </ExamWizardShell>
  );
};

export default CargarRespuestasContent;

CargarRespuestasContent.propTypes = {
  examId: PropTypes.string.isRequired,
};
