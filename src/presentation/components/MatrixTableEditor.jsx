import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  createDefaultMatrix,
  normalizeMatrixRows,
  addMatrixColumn,
  removeMatrixColumn,
  addMatrixRow,
  removeMatrixRow,
  updateMatrixCell,
  updateMatrixColumnHeader,
} from './matrixTableUtils';

const MatrixTableEditor = ({
  matrixColumns: columnsProp,
  matrixRows: rowsProp,
  onChange,
  readOnly = false,
}) => {
  const defaults = createDefaultMatrix();
  const columns = columnsProp?.length ? columnsProp : defaults.matrixColumns;
  const rows = normalizeMatrixRows(columns, rowsProp?.length ? rowsProp : defaults.matrixRows);

  const emit = (next) => onChange(next);

  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1.5 }}>
        Tabla de referencia (respuesta del docente). El alumno no ve esta tabla.
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f0f4f8' }}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex} sx={{ fontWeight: 600, minWidth: 120 }}>
                  {readOnly ? (
                    col || `Columna ${colIndex + 1}`
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder={`Columna ${colIndex + 1}`}
                        value={col}
                        onChange={(e) => emit(updateMatrixColumnHeader(columns, rows, colIndex, e.target.value))}
                      />
                      {columns.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => emit(removeMatrixColumn(columns, rows, colIndex))}
                          sx={{ color: '#999' }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </TableCell>
              ))}
              {!readOnly && <TableCell sx={{ width: 48 }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex}>
                    {readOnly ? (
                      cell || '—'
                    ) : (
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="..."
                        value={cell}
                        onChange={(e) =>
                          emit(updateMatrixCell(columns, rows, rowIndex, colIndex, e.target.value))
                        }
                      />
                    )}
                  </TableCell>
                ))}
                {!readOnly && (
                  <TableCell>
                    <IconButton
                      size="small"
                      disabled={rows.length <= 1}
                      onClick={() => emit(removeMatrixRow(columns, rows, rowIndex))}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!readOnly && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => emit(addMatrixRow(columns, rows))}
            sx={{ textTransform: 'none', color: '#001f56' }}
          >
            Agregar fila
          </Button>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => emit(addMatrixColumn(columns, rows))}
            sx={{ textTransform: 'none', color: '#001f56' }}
          >
            Agregar columna
          </Button>
        </Box>
      )}
    </Box>
  );
};

MatrixTableEditor.propTypes = {
  matrixColumns: PropTypes.arrayOf(PropTypes.string),
  matrixRows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default MatrixTableEditor;
