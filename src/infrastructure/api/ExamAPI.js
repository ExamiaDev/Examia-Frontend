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
};

export default ExamAPI;

