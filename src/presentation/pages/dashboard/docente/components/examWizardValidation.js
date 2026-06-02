import { isDecisionTreeContentComplete } from '../../../../components/decisionTreeUtils';
import { isMatrixComplete } from '../../../../components/matrixTableUtils';
import { getQuestionTypeLabel, sumQuestionPoints } from './examWizardUtils';

export const isDecisionTreeComplete = isDecisionTreeContentComplete;

const validateMultipleChoiceQuestion = (tema, q, requireCorrect) => {
  const label = `${tema.nombre} · ${getQuestionTypeLabel(q.type)}`;
  const opciones = (q.opciones || []).filter(Boolean);
  if (opciones.length < 2) return `${label}: agregá al menos 2 opciones`;
  if (requireCorrect && q.correcta == null) return `${label}: marcá la opción correcta`;
  return null;
};

const validateQuestionAnswer = (tema, q) => {
  const label = `${tema.nombre} · ${getQuestionTypeLabel(q.type)}`;

  if (q.type === 'multiple-choice') {
    return validateMultipleChoiceQuestion(tema, q, true);
  }
  if (q.type === 'tabla' && !isMatrixComplete(q.matrixColumns, q.matrixRows)) {
    return `${label}: completá la tabla (columnas, filas y celdas)`;
  }
  if (q.type === 'arbol-decision' && !isDecisionTreeComplete(q.decisionTree)) {
    return `${label}: completá el árbol de decisión`;
  }
  return null;
};

export const validateStepQuestions = (temas) => {
  const total = temas.reduce((acc, t) => acc + t.preguntas.length, 0);
  if (total === 0) return 'Agregá al menos una pregunta';

  const sinEnunciado = temas.flatMap((t) =>
    t.preguntas
      .filter((q) => !(q.enunciado || '').trim())
      .map((q) => `${t.nombre} (${getQuestionTypeLabel(q.type)})`),
  );
  if (sinEnunciado.length) return `Completá el enunciado de: ${sinEnunciado.join(', ')}`;

  const temasInvalidos = temas.filter((t) => sumQuestionPoints(t.preguntas) !== 10);
  if (temasInvalidos.length) {
    return `El puntaje de ${temasInvalidos.map((t) => t.nombre).join(', ')} debe sumar exactamente 10`;
  }

  for (const tema of temas) {
    for (const q of tema.preguntas) {
      if (q.type === 'multiple-choice') {
        const err = validateMultipleChoiceQuestion(tema, q, false);
        if (err) return err;
      }
    }
  }

  return null;
};

export const validateStepAnswers = (temas) => {
  for (const tema of temas) {
    for (const q of tema.preguntas) {
      const err = validateQuestionAnswer(tema, q);
      if (err) return err;
    }
  }
  return null;
};
