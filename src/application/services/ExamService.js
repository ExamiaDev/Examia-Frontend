import ExamAPI from '../../infrastructure/api/ExamAPI';
import { AppError } from '../../domain/errors/AppErrors';

/**
 * ExamService - Capa de aplicación para gestión de exámenes
 *
 * Maneja la lógica de negocio relacionada con exámenes:
 * - Creación y actualización de exámenes
 * - Publicación de exámenes
 * - Validaciones de datos
 * - Manejo de errores específicos del dominio
 */
export class ExamService {
  /**
   * Crear un nuevo examen
   * @param {Object} examData - Datos del examen
   * @param {string} examData.nombre - Nombre del examen
   * @param {string} examData.descripcion - Descripción del examen
   * @param {string} examData.curso - ID del curso
   * @param {string} examData.turno - Turno del examen
   * @param {number} examData.puntajeTotal - Puntaje total
   * @param {Array<Object>} examData.preguntas - Array de preguntas
   * @returns {Promise<Object>} Examen creado
   * @throws {AppError} Si hay error en la creación
   */
  static async createExam(examData) {
    try {
      // Validar datos requeridos
      if (!examData.nombre || examData.nombre.trim() === '') {
        throw new AppError('El nombre del examen es obligatorio');
      }
      if (!examData.curso || examData.curso.trim() === '') {
        throw new AppError('El curso es obligatorio');
      }
      if (!examData.puntajeTotal || examData.puntajeTotal <= 0) {
        throw new AppError('El puntaje total debe ser mayor a 0');
      }
      if (!Array.isArray(examData.preguntas) || examData.preguntas.length === 0) {
        throw new AppError('El examen debe tener al menos una pregunta');
      }

      // Validar puntajes de preguntas
      const sumaPuntajes = examData.preguntas.reduce((sum, q) => sum + (q.puntaje || 0), 0);
      if (sumaPuntajes !== examData.puntajeTotal) {
        throw new AppError(
          `La suma de puntajes (${sumaPuntajes}) debe coincidir con el puntaje total (${examData.puntajeTotal})`
        );
      }

      const exam = await ExamAPI.createExam(examData);
      return exam;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error desconocido al crear el examen');
    }
  }

  /**
   * Obtener lista de exámenes
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.estado - Filtrar por estado (borrador, publicado, activo)
   * @param {string} filters.curso - Filtrar por curso
   * @returns {Promise<Array<Object>>} Lista de exámenes
   */
  static async getExams(filters = {}) {
    try {
      const exams = await ExamAPI.getExams(filters);
      return exams;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al obtener los exámenes');
    }
  }

  /**
   * Obtener un examen específico
   * @param {string} examId - ID del examen
   * @returns {Promise<Object>} Datos del examen
   */
  static async getExamById(examId) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      const exam = await ExamAPI.getExamById(examId);
      return exam;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al obtener el examen');
    }
  }

  /**
   * Actualizar un examen
   * @param {string} examId - ID del examen
   * @param {Object} examData - Datos a actualizar
   * @returns {Promise<Object>} Examen actualizado
   */
  static async updateExam(examId, examData) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }

      // Validar puntajes si se actualizan preguntas
      if (examData.preguntas && Array.isArray(examData.preguntas)) {
        const sumaPuntajes = examData.preguntas.reduce((sum, q) => sum + (q.puntaje || 0), 0);
        const puntajeTotal = examData.puntajeTotal || 10;
        if (sumaPuntajes !== puntajeTotal) {
          throw new AppError(
            `La suma de puntajes (${sumaPuntajes}) debe coincidir con el puntaje total (${puntajeTotal})`
          );
        }
      }

      const exam = await ExamAPI.updateExam(examId, examData);
      return exam;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al actualizar el examen');
    }
  }

  /**
   * Eliminar un examen
   * @param {string} examId - ID del examen
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async deleteExam(examId) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      return await ExamAPI.deleteExam(examId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al eliminar el examen');
    }
  }

  /**
   * Publicar un examen (cambiar estado a publicado)
   * @param {string} examId - ID del examen
   * @returns {Promise<Object>} Examen publicado
   */
  static async publishExam(examId) {
    try {
      if (!examId || examId.trim() === '') {
        throw new AppError('El ID del examen es obligatorio');
      }
      return await ExamAPI.publishExam(examId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error al publicar el examen');
    }
  }
}

export default ExamService;

