import httpClient from '../http/httpClient';
import { AppError } from '../../domain/errors/AppErrors';

export const ExamAPI = {
  // Crear un nuevo examen
  createExam: async (examData) => {
    try {
      const response = await httpClient.post('/exams', examData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al crear el examen. Intentá de nuevo.');
    }
  },

  // Obtener lista de exámenes
  getExams: async (filters = {}) => {
    try {
      const response = await httpClient.get('/exams', { params: filters });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener los exámenes.');
    }
  },

  // Obtener un examen específico
  getExamById: async (examId) => {
    try {
      const response = await httpClient.get(`/exams/${examId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener el examen.');
    }
  },

  // Actualizar un examen
  updateExam: async (examId, examData) => {
    try {
      const response = await httpClient.put(`/exams/${examId}`, examData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al actualizar el examen.');
    }
  },

  // Eliminar un examen
  deleteExam: async (examId) => {
    try {
      const response = await httpClient.delete(`/exams/${examId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al eliminar el examen.');
    }
  },

  // Publicar un examen (cambiar estado a publicado)
  publishExam: async (examId) => {
    try {
      const response = await httpClient.post(`/exams/${examId}/publish`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al publicar el examen.');
    }
  },

  // Cargar respuestas del examen
  submitExamResponses: async (examId, responses) => {
    try {
      const response = await httpClient.post(`/exams/${examId}/responses`, responses);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.status === 400) {
        throw new AppError('Respuestas inválidas. Verificá los datos enviados.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al enviar las respuestas.');
    }
  },

  // Obtener respuestas de un examen (para docentes)
  getExamResponses: async (examId) => {
    try {
      const response = await httpClient.get(`/exams/${examId}/responses`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen o las respuestas no fueron encontradas.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener las respuestas.');
    }
  },

  // Obtener respuesta específica de un usuario
  getUserExamResponse: async (examId, userId) => {
    try {
      const response = await httpClient.get(`/exams/${examId}/responses/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('La respuesta del usuario no fue encontrada.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener la respuesta del usuario.');
    }
  },

  // Calificar respuestas de un examen
  gradeExamResponse: async (examId, userId, gradeData) => {
    try {
      const response = await httpClient.post(`/exams/${examId}/responses/${userId}/grade`, gradeData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al calificar el examen.');
    }
  },

  // Obtener todos los exámenes publicados (alumno)
  getPublishedExams: async () => {
    try {
      const response = await httpClient.get('/exams/published');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener los exámenes disponibles.');
    }
  },

  // Entregar respuestas de un examen (alumno)
  // answersData: { answers: [{questionId, selectedOptions, textAnswer, orderAnswer, matchingAnswer}] }
  submitExam: async (examId, answersData) => {
    try {
      const response = await httpClient.post(`/exams/${examId}/submissions`, answersData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new AppError('Ya entregaste este examen anteriormente.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al entregar el examen.');
    }
  },

  // --- Submissions (entregas de alumnos) ---

  // Obtener todas las entregas de un examen (docente)
  getSubmissions: async (examId) => {
    try {
      const response = await httpClient.get(`/exams/${examId}/submissions`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('El examen no fue encontrado.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener las entregas.');
    }
  },

  // Obtener una entrega específica con todas las respuestas del alumno
  getSubmission: async (examId, submissionId) => {
    try {
      const response = await httpClient.get(`/exams/${examId}/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('La entrega no fue encontrada.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener la entrega.');
    }
  },

  // Alumno: historial de sus propias entregas
  getMySubmissions: async () => {
    try {
      const response = await httpClient.get('/submissions/my');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener tus resultados.');
    }
  },

  // Alumno: detalle de una entrega propia
  getMySubmission: async (submissionId) => {
    try {
      const response = await httpClient.get(`/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new AppError('La entrega no fue encontrada.');
      }
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al obtener el resultado.');
    }
  },

  // Calificar una entrega (docente)
  // gradeData: { questionGrades: [{questionId, score, feedback}], totalScore, teacherFeedback }
  gradeSubmission: async (examId, submissionId, gradeData) => {
    try {
      const response = await httpClient.post(
        `/exams/${examId}/submissions/${submissionId}/grade`,
        gradeData,
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new AppError(error.response.data.message);
      }
      throw new AppError('Error al calificar la entrega.');
    }
  },
};

export default ExamAPI;

