import ExamAPI from '../../infrastructure/api/ExamAPI';
import { AppError } from '../../domain/errors/AppErrors';

const sumQuestionPoints = (questions = []) =>
  questions.reduce((sum, q) => sum + Number(q.points || 0), 0);

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
      // Validar datos requeridos (campos en inglés según el contrato del backend)
      if (!examData.title || examData.title.trim() === '') {
        throw new AppError('El nombre del examen es obligatorio');
      }
      if (!examData.subjectId || examData.subjectId.trim() === '') {
        throw new AppError('El curso/materia es obligatorio');
      }
      if (!Array.isArray(examData.questions) || examData.questions.length === 0) {
        throw new AppError('El examen debe tener al menos una pregunta');
      }

      const totalPoints = sumQuestionPoints(examData.questions);
      if (totalPoints <= 0) {
        throw new AppError('El puntaje total debe ser mayor a 0');
      }

      const exam = await ExamAPI.createExam({
        ...examData,
        totalPoints,
      });
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

      const exam = await ExamAPI.updateExam(examId, {
        ...examData,
        ...(examData.questions && {
          totalPoints: sumQuestionPoints(examData.questions),
        }),
      });
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

