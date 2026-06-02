import PropTypes from 'prop-types';
import { Box, Typography, Chip, Stack } from '@mui/material';
import DecisionTreeEditor from './DecisionTreeEditor';
import MatrixTableEditor from './MatrixTableEditor';
import { getReferenceDecisionTree, getStudentDecisionTree } from './decisionTreeUtils';
import { getReferenceMatrixFromAnswer, getStudentMatrixFromAnswer } from './matrixTableUtils';

export const AnswerSection = ({ title, children, emptyMessage = 'Sin contenido' }) => (
  <Box>
    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
      {title}
    </Typography>
    {children ?? (
      <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>{emptyMessage}</Typography>
    )}
  </Box>
);

AnswerSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  emptyMessage: PropTypes.string,
};

export const DecisionTreeComparison = ({ answer }) => {
  const referenceTree = getReferenceDecisionTree(answer);
  const studentTree = getStudentDecisionTree(answer);
  const legacyPath = answer.orderAnswer ?? [];

  return (
    <Stack spacing={2} sx={{ mt: 1.5 }}>
      <AnswerSection title="Árbol de referencia del profesor (guía de corrección)">
        {referenceTree ? <DecisionTreeEditor tree={referenceTree} readOnly onChange={() => {}} /> : null}
      </AnswerSection>
      <AnswerSection
        title="Árbol del alumno"
        emptyMessage="El alumno no envió un árbol (entrega anterior al fix o examen editado). Pedí una nueva entrega."
      >
        {studentTree ? (
          <DecisionTreeEditor tree={studentTree} readOnly onChange={() => {}} />
        ) : legacyPath.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {legacyPath.map((step, idx) => (
              <Chip key={`${step}-${idx}`} label={step} size="small" sx={{ bgcolor: '#eef2ff', color: '#001f56' }} />
            ))}
          </Box>
        ) : null}
      </AnswerSection>
    </Stack>
  );
};

DecisionTreeComparison.propTypes = {
  answer: PropTypes.object.isRequired,
};

export const MatrixComparison = ({ answer }) => {
  const referenceMatrix = getReferenceMatrixFromAnswer(answer);
  const studentMatrix = getStudentMatrixFromAnswer(answer);

  return (
    <Stack spacing={2} sx={{ mt: 1.5 }}>
      <AnswerSection title="Tabla de referencia del profesor (guía de corrección)">
        {referenceMatrix ? (
          <MatrixTableEditor
            readOnly
            caption="Guía de corrección"
            matrixColumns={referenceMatrix.matrixColumns}
            matrixRows={referenceMatrix.matrixRows}
            onChange={() => {}}
          />
        ) : null}
      </AnswerSection>
      <AnswerSection
        title="Tabla del alumno"
        emptyMessage="El alumno no envió una tabla (entrega anterior al fix o examen editado). Pedí una nueva entrega."
      >
        {studentMatrix ? (
          <MatrixTableEditor
            readOnly
            caption="Respuesta del alumno"
            matrixColumns={studentMatrix.matrixColumns}
            matrixRows={studentMatrix.matrixRows}
            onChange={() => {}}
          />
        ) : null}
      </AnswerSection>
    </Stack>
  );
};

MatrixComparison.propTypes = {
  answer: PropTypes.object.isRequired,
};

const emptyStudentMessage = (
  <Typography variant="body2" sx={{ color: '#888', mt: 1.5 }}>
    Sin respuesta
  </Typography>
);

export const StudentDecisionTreeView = ({ answer }) => {
  const studentTree = getStudentDecisionTree(answer);
  if (!studentTree) return emptyStudentMessage;
  return <DecisionTreeEditor tree={studentTree} readOnly onChange={() => {}} />;
};

StudentDecisionTreeView.propTypes = {
  answer: PropTypes.object.isRequired,
};

export const StudentMatrixView = ({ answer }) => {
  const studentMatrix = getStudentMatrixFromAnswer(answer);
  if (!studentMatrix) return emptyStudentMessage;
  return (
    <MatrixTableEditor
      readOnly
      matrixColumns={studentMatrix.matrixColumns}
      matrixRows={studentMatrix.matrixRows}
      onChange={() => {}}
    />
  );
};

StudentMatrixView.propTypes = {
  answer: PropTypes.object.isRequired,
};
