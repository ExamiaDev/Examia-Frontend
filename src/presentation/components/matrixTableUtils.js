export const createDefaultMatrix = () => ({
  matrixColumns: ['Columna 1', 'Columna 2'],
  matrixRows: [
    ['', ''],
    ['', ''],
  ],
});

export const normalizeMatrixRows = (columns, rows = []) => {
  const colCount = columns.length;
  return rows.map((row) => {
    const cells = [...(row || [])];
    while (cells.length < colCount) cells.push('');
    return cells.slice(0, colCount);
  });
};

export const addMatrixColumn = (columns, rows) => {
  const nextCols = [...columns, `Columna ${columns.length + 1}`];
  const nextRows = normalizeMatrixRows(nextCols, rows).map((row) => [...row, '']);
  return { matrixColumns: nextCols, matrixRows: nextRows };
};

export const removeMatrixColumn = (columns, rows, colIndex) => {
  if (columns.length <= 1) return { matrixColumns: columns, matrixRows: rows };
  const nextCols = columns.filter((_, i) => i !== colIndex);
  const nextRows = normalizeMatrixRows(
    nextCols,
    rows.map((row) => row.filter((_, i) => i !== colIndex)),
  );
  return { matrixColumns: nextCols, matrixRows: nextRows };
};

export const addMatrixRow = (columns, rows) => {
  const emptyRow = columns.map(() => '');
  return { matrixColumns: columns, matrixRows: [...normalizeMatrixRows(columns, rows), emptyRow] };
};

export const removeMatrixRow = (columns, rows, rowIndex) => {
  if (rows.length <= 1) return { matrixColumns: columns, matrixRows: rows };
  return {
    matrixColumns: columns,
    matrixRows: rows.filter((_, i) => i !== rowIndex),
  };
};

export const updateMatrixCell = (columns, rows, rowIndex, colIndex, value) => ({
  matrixColumns: columns,
  matrixRows: rows.map((row, ri) =>
    ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row,
  ),
});

export const updateMatrixColumnHeader = (columns, rows, colIndex, value) => ({
  matrixColumns: columns.map((c, i) => (i === colIndex ? value : c)),
  matrixRows: rows,
});

export const migrateParesToMatrix = (pares = []) => {
  if (!pares.length) return createDefaultMatrix();
  return {
    matrixColumns: ['Elemento', 'Valor'],
    matrixRows: pares.map((p) => [p.izquierda || '', p.derecha || '']),
  };
};

export const isMatrixComplete = (columns = [], rows = []) => {
  if (columns.length < 2 || rows.length < 1) return false;
  if (columns.some((c) => !(c || '').trim())) return false;
  return rows.every((row) =>
    row.length === columns.length && row.every((cell) => (cell || '').trim()),
  );
};

export const getMatrixFromQuestion = (question) => {
  if (question?.matrixColumns?.length) {
    return {
      matrixColumns: [...question.matrixColumns],
      matrixRows: normalizeMatrixRows(question.matrixColumns, question.matrixRows),
    };
  }
  if (question?.matrixColumnHeaders?.length) {
    return {
      matrixColumns: [...question.matrixColumnHeaders],
      matrixRows: normalizeMatrixRows(question.matrixColumnHeaders, question.matrixRows),
    };
  }
  return null;
};
