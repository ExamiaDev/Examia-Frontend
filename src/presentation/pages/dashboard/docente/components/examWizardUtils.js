import { createDefaultDecisionTree, isDecisionTreeContentComplete } from '../../../../components/decisionTreeUtils';
import {
  createDefaultMatrix,
  migrateParesToMatrix,
  isMatrixComplete,
} from '../../../../components/matrixTableUtils';

export const WIZARD_STEPS = ['Crear examen', 'Cargar respuestas', 'Crear acceso'];

export const CURSOS = [
  { id: 1, nombre: 'Testing de Aplicaciones - Mañana' },
  { id: 2, nombre: 'Testing de Aplicaciones - Tarde' },
  { id: 3, nombre: 'Testing de Aplicaciones - Noche' },
];

export const TURNOS = [
  { id: 1, nombre: 'Mañana' },
  { id: 2, nombre: 'Tarde' },
  { id: 3, nombre: 'Noche' },
];

export const QUESTION_TYPES = [
  { id: 'texto-libre', title: 'Texto libre' },
  { id: 'tabla', title: 'Tabla' },
  { id: 'arbol-decision', title: 'Árbol de decisión' },
  { id: 'multiple-choice', title: 'Múltiple choice' },
];

export const PUNTAJE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const TOPIC_COLORS = [
  '#1565c0', '#2e7d32', '#6a1b9a', '#c62828',
  '#e65100', '#00838f', '#4527a0', '#558b2f',
];

export const QUESTION_TYPE_MAP = {
  'texto-libre': 'LONG_ANSWER',
  'tabla': 'MATRIX',
  'arbol-decision': 'DECISION_TREE',
  'multiple-choice': 'MULTIPLE_CHOICE',
};

export const API_TYPE_MAP = Object.fromEntries(
  Object.entries(QUESTION_TYPE_MAP).map(([ui, api]) => [api, ui]),
);

export const buildMatchingPairs = (pares) =>
  Object.fromEntries((pares || []).filter((p) => p.izquierda).map((p) => [p.izquierda, p.derecha || '']));

export const sumQuestionPoints = (preguntas = []) =>
  preguntas.reduce((sum, q) => sum + Number(q.puntaje || 0), 0);

export const getQuestionTypeLabel = (typeId) =>
  QUESTION_TYPES.find((t) => t.id === typeId)?.title || typeId;

export const mapApiQuestionToUi = (q) => {
  const type = API_TYPE_MAP[q.type] || 'texto-libre';
  const base = {
    id: q.id,
    type,
    enunciado: q.text || '',
    puntaje: q.points ?? 1,
  };

  if (type === 'multiple-choice') {
    base.opciones = q.options?.length ? [...q.options] : ['', '', '', ''];
    base.correcta = q.correctAnswers?.[0] ?? null;
  }
  if (type === 'tabla') {
    if (q.matrixColumnHeaders?.length) {
      base.matrixColumns = [...q.matrixColumnHeaders];
      base.matrixRows = (q.matrixRows || []).map((row) => [...row]);
    } else {
      const pairs = q.matchingPairs ? Object.entries(q.matchingPairs) : [];
      const migrated = pairs.length
        ? migrateParesToMatrix(pairs.map(([izquierda, derecha]) => ({ izquierda, derecha })))
        : createDefaultMatrix();
      base.matrixColumns = migrated.matrixColumns;
      base.matrixRows = migrated.matrixRows;
    }
  }
  if (type === 'arbol-decision') {
    base.decisionTree = q.decisionTree ?? createDefaultDecisionTree();
  }
  if (type === 'texto-libre' && q.correctTextAnswer) {
    base.respuestaModelo = q.correctTextAnswer;
  }

  return base;
};

export const groupQuestionsIntoTemas = (questions = []) => {
  if (!questions.length) {
    return [{ id: 1, nombre: 'Tema 1', color: TOPIC_COLORS[0], preguntas: [] }];
  }

  const topicMap = new Map();
  questions.forEach((q) => {
    const topicName = q.topic || 'Tema 1';
    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, {
        id: topicMap.size + 1,
        nombre: topicName,
        color: q.topicColor || TOPIC_COLORS[topicMap.size % TOPIC_COLORS.length],
        preguntas: [],
      });
    }
    topicMap.get(topicName).preguntas.push(mapApiQuestionToUi(q));
  });

  return Array.from(topicMap.values());
};

export const examToWizardState = (exam) => ({
  formData: {
    nombre: exam.title || '',
    curso: exam.subjectId || '',
    turno: exam.shift || '',
    periodo: '2026 - 1°c',
  },
  temas: groupQuestionsIntoTemas(exam.questions || []),
  published: !!exam.published,
});

export const buildQuestionPayload = (tema, q, { includeAnswers = true } = {}) => {
  const base = {
    type: QUESTION_TYPE_MAP[q.type] || 'LONG_ANSWER',
    text: (q.enunciado || '').trim(),
    points: Number(q.puntaje) || 1,
    topic: tema.nombre,
    topicColor: tema.color || TOPIC_COLORS[0],
  };

  if (typeof q.id === 'string' && q.id.includes('-')) {
    base.id = q.id;
  }

  if (!includeAnswers) {
    if (q.type === 'multiple-choice' && q.opciones) {
      base.options = q.opciones;
    }
    return base;
  }

  if (q.type === 'multiple-choice' && q.opciones) {
    base.options = q.opciones;
    if (q.correcta != null) base.correctAnswers = [q.correcta];
  }
  if (q.type === 'arbol-decision' && q.decisionTree) {
    base.decisionTree = q.decisionTree;
  }
  if (q.type === 'tabla' && q.matrixColumns?.length) {
    base.matrixColumnHeaders = q.matrixColumns;
    base.matrixRows = q.matrixRows;
  }
  if (q.type === 'texto-libre' && q.respuestaModelo?.trim()) {
    base.correctTextAnswer = q.respuestaModelo.trim();
  }

  return base;
};

export const buildExamPayload = (formData, temas, { includeAnswers = true } = {}) => ({
  title: formData.nombre,
  subjectId: formData.curso ? String(formData.curso) : '',
  shift: formData.turno ? String(formData.turno) : '',
  period: formData.periodo,
  questions: temas.flatMap((tema) =>
    tema.preguntas.map((q) => buildQuestionPayload(tema, q, { includeAnswers })),
  ),
});

export const validateExamMetadata = (formData) => {
  if (!formData.nombre?.trim()) return 'El nombre del examen es obligatorio';
  if (!formData.curso) return 'Tenés que seleccionar un curso';
  if (!formData.turno) return 'Tenés que seleccionar un turno';
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
        const opciones = (q.opciones || []).filter(Boolean);
        if (opciones.length < 2) {
          return `${tema.nombre} · Múltiple choice: agregá al menos 2 opciones`;
        }
      }
    }
  }

  return null;
};

export const isDecisionTreeComplete = isDecisionTreeContentComplete;

export const validateStepAnswers = (temas) => {
  for (const tema of temas) {
    for (const q of tema.preguntas) {
      const label = `${tema.nombre} · ${getQuestionTypeLabel(q.type)}`;

      if (q.type === 'multiple-choice') {
        const opciones = (q.opciones || []).filter(Boolean);
        if (opciones.length < 2) return `${label}: agregá al menos 2 opciones`;
        if (q.correcta == null) return `${label}: marcá la opción correcta`;
      }

      if (q.type === 'tabla') {
        if (!isMatrixComplete(q.matrixColumns, q.matrixRows)) {
          return `${label}: completá la tabla (columnas, filas y celdas)`;
        }
      }

      if (q.type === 'arbol-decision') {
        if (!isDecisionTreeComplete(q.decisionTree)) {
          return `${label}: completá el árbol de decisión`;
        }
      }
    }
  }
  return null;
};

export const createEmptyQuestion = (typeId) => ({
  id: Date.now(),
  type: typeId,
  enunciado: '',
  puntaje: 1,
  ...(typeId === 'multiple-choice' && { opciones: ['', '', '', ''], correcta: null }),
  ...(typeId === 'tabla' && createDefaultMatrix()),
  ...(typeId === 'arbol-decision' && {
    decisionTree: createDefaultDecisionTree(),
  }),
  ...(typeId === 'texto-libre' && { respuestaModelo: '' }),
});
