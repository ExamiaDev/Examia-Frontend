/**
 * Filtrado de respuestas al tema asignado al alumno.
 *
 * Un alumno realiza UN solo tema por examen, pero por compatibilidad histórica
 * la entrega puede contener respuestas (vacías) de todos los temas del examen.
 * Estas utilidades permiten quedarnos únicamente con el tema que el alumno
 * efectivamente rindió, evitando que sumen 0 puntos al puntaje total y que se
 * muestren preguntas que no le tocaron.
 */

const topicKey = (answer) => answer?.topic || 'Sin tema';

/**
 * Considera "respondida" toda respuesta con algún dato del alumno
 * (selección, texto, orden, emparejamiento, árbol o matriz).
 */
export const isAnswerProvided = (answer) => {
  if (!answer) return false;
  if (Array.isArray(answer.selectedOptions) && answer.selectedOptions.length > 0) return true;
  if (typeof answer.textAnswer === 'string' && answer.textAnswer.trim().length > 0) return true;
  if (Array.isArray(answer.orderAnswer) && answer.orderAnswer.length > 0) return true;
  if (answer.matchingAnswer && Object.keys(answer.matchingAnswer).length > 0) return true;

  const studentTree = answer.studentDecisionTree ?? answer.student_decision_tree;
  if (studentTree) {
    if (Array.isArray(studentTree.nodes) && studentTree.nodes.length > 0) return true;
    if (studentTree.nodes && typeof studentTree.nodes === 'object'
      && Object.keys(studentTree.nodes).length > 0) return true;
  }

  const studentRows = answer.studentMatrixRows ?? answer.student_matrix_rows;
  if (Array.isArray(studentRows)
    && studentRows.some((row) => Array.isArray(row)
      && row.some((cell) => (cell ?? '').toString().trim().length > 0))) return true;

  const studentHeaders = answer.studentMatrixColumnHeaders ?? answer.student_matrix_column_headers;
  if (Array.isArray(studentHeaders)
    && studentHeaders.some((h) => (h ?? '').toString().trim().length > 0)) return true;

  return false;
};

/**
 * Devuelve el tema al que pertenecen las respuestas del alumno.
 * Estrategia:
 *   1) Si hay temas con respuestas, elegir el tema con MÁS respuestas reales.
 *   2) Si no hay ninguna respuesta proveída (entrega en blanco), devolver el
 *      primer tema presente.
 *   3) Si no hay respuestas, devolver null.
 */
export const resolveStudentTopic = (answers = []) => {
  if (answers.length === 0) return null;

  const answeredCount = new Map();
  answers.forEach((a) => {
    if (!isAnswerProvided(a)) return;
    const t = topicKey(a);
    answeredCount.set(t, (answeredCount.get(t) ?? 0) + 1);
  });

  if (answeredCount.size > 0) {
    let bestTopic = null;
    let bestCount = -1;
    answeredCount.forEach((count, t) => {
      if (count > bestCount) { bestCount = count; bestTopic = t; }
    });
    return bestTopic;
  }

  return topicKey(answers[0]);
};

/**
 * Filtra las respuestas para quedarse únicamente con las del tema asignado al
 * alumno. Si no se puede inferir, devuelve el arreglo original.
 */
export const filterAnswersToStudentTopic = (answers = []) => {
  if (answers.length === 0) return answers;
  const topic = resolveStudentTopic(answers);
  if (topic == null) return answers;
  return answers.filter((a) => topicKey(a) === topic);
};

