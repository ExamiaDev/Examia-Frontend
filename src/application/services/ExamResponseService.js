import ExamAPI from '../../infrastructure/api/ExamAPI';
import { AppError } from '../../domain/errors/AppErrors';

/**
 * ExamResponseService - Capa de aplicación para gestión de respuestas de exámenes
 *
 * Maneja la lógica de negocio relacionada con:
 * - Envío de respuestas de alumnos
 * - Obtención de respuestas para docentes
 * - Calificación automática y manual
 */
export class ExamResponseService {
  /**
   * Enviar respuestas a un examen (para alumnos)
   * @param {string} examId - ID del examen
   * @param {Array<Object>} responses - Respuestas del alumno
   * @returns {Promise<Object>} Respuesta del servidor
   * @throws {AppError} Si hay error al enviar respuestas
   */
  static async submitResponses(examId, responses) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      if (!Array.isArray(responses) || responses.length === 0) {
        throw new AppError('Debe enviar al menos una respuesta');
      }

      // Validar que todas las respuestas tengan al menos preguntaId
      const allValid = responses.every(r => r.preguntaId);
      if (!allValid) {
        throw new AppError('Todas las respuestas deben incluir el ID de la pregunta');
      }

      const result = await ExamAPI.submitExamResponses(examId, { respuestas: responses });
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al enviar las respuestas');
    }
  }

  /**
   * Obtener todas las respuestas de un examen (para docentes)
   * @param {string} examId - ID del examen
   * @returns {Promise<Array<Object>>} Respuestas de todos los alumnos
   */
  static async getExamResponses(examId) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      const responses = await ExamAPI.getExamResponses(examId);
      return responses;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al obtener las respuestas del examen');
    }
  }

  /**
   * Obtener respuesta específica de un usuario para un examen
   * @param {string} examId - ID del examen
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Respuestas del usuario
   */
  static async getUserResponse(examId, userId) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      if (!userId || userId.trim() === '') {
        throw new AppError('El ID del usuario es obligatorio');
      }
      const response = await ExamAPI.getUserExamResponse(examId, userId);
      return response;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al obtener la respuesta del usuario');
    }
  }

  /**
   * Calificar respuestas de un usuario
   * @param {string} examId - ID del examen
   * @param {string} userId - ID del usuario
   * @param {Object} gradeData - Datos de calificación
   * @param {number} gradeData.calificacion - Calificación (0-10)
   * @param {string} gradeData.comentarios - Comentarios del docente (opcional)
   * @param {Array<Object>} gradeData.calificacionesPreguntas - Calificaciones por pregunta (opcional)
   * @returns {Promise<Object>} Resultado de calificación
   */
  static async gradeUserResponse(examId, userId, gradeData) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      if (!userId || userId.trim() === '') {
        throw new AppError('El ID del usuario es obligatorio');
      }
      if (gradeData.calificacion === undefined || gradeData.calificacion === null) {
        throw new AppError('La calificación es obligatoria');
      }
      if (gradeData.calificacion < 0 || gradeData.calificacion > 10) {
        throw new AppError('La calificación debe estar entre 0 y 10');
      }

      const result = await ExamAPI.gradeExamResponse(examId, userId, gradeData);
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al calificar la respuesta');
    }
  }

  /**
   * Contar respuestas pendientes de calificación
   * @param {Array<Object>} responses - Array de respuestas
   * @returns {number} Cantidad de respuestas pendientes
   */
  static countPendingGrades(responses) {
    return responses.filter(r => r.estado === 'pendiente' || !r.calificacion).length;
  }

  /**
   * Agrupar respuestas por estado
   * @param {Array<Object>} responses - Array de respuestas
   * @returns {Object} Respuestas agrupadas por estado
   */
  static groupByStatus(responses) {
    return {
      pendiente: responses.filter(r => r.estado === 'pendiente' || !r.calificacion),
      calificada: responses.filter(r => r.estado === 'calificada' && r.calificacion !== undefined),
    };
  }

  /**
   * Calcular estadísticas de calificaciones de un examen
   * @param {Array<Object>} responses - Array de respuestas con calificaciones
   * @returns {Object} Estadísticas
   */
  static calculateStats(responses) {
    const calificaciones = responses
      .filter(r => r.calificacion !== undefined && r.calificacion !== null)
      .map(r => r.calificacion);

    if (calificaciones.length === 0) {
      return { promedio: 0, minima: 0, maxima: 0, total: 0 };
    }

    const suma = calificaciones.reduce((a, b) => a + b, 0);
    const promedio = suma / calificaciones.length;

    return {
      promedio: parseFloat(promedio.toFixed(2)),
      minima: Math.min(...calificaciones),
      maxima: Math.max(...calificaciones),
      total: calificaciones.length,
    };
  }
}

export default ExamResponseService;

