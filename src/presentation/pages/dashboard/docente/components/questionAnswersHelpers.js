export const updateOpcionText = (opciones, index, value) => {
  const next = [...opciones];
  next[index] = value;
  return next;
};

export const removeOpcion = (opciones, correcta, index) => {
  const next = opciones.filter((_, idx) => idx !== index);
  const nextCorrecta = correcta === index ? null : correcta > index ? correcta - 1 : correcta;
  return { opciones: next, correcta: nextCorrecta };
};

export const updateTemasQuestion = (temas, temaIndex, questionId, updated) =>
  temas.map((tema, idx) =>
    (idx === temaIndex
      ? { ...tema, preguntas: tema.preguntas.map((q) => (q.id === questionId ? updated : q)) }
      : tema),
  );
