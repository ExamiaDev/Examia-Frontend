import ExamAPI from '../../infrastructure/api/ExamAPI';
import { AppError } from '../../domain/errors/AppErrors';

export class SubmissionService {
  static async getSubmissions(examId) {
    if (!examId) throw new AppError('El ID del examen es obligatorio');
    try {
      return await ExamAPI.getSubmissions(examId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener las entregas del examen');
    }
  }

  static async getSubmission(examId, submissionId) {
    if (!examId) throw new AppError('El ID del examen es obligatorio');
    if (!submissionId) throw new AppError('El ID de la entrega es obligatorio');
    try {
      return await ExamAPI.getSubmission(examId, submissionId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener la entrega');
    }
  }

  // answers: [{ questionId, selectedOptions?, textAnswer?, orderAnswer?, matchingAnswer? }]
  static async submitExam(examId, answers) {
    if (!examId) throw new AppError('El ID del examen es obligatorio');
    if (!answers || answers.length === 0) throw new AppError('Debés responder al menos una pregunta');
    try {
      return await ExamAPI.submitExam(examId, { answers });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al entregar el examen');
    }
  }

  static async getMySubmissions() {
    try {
      return await ExamAPI.getMySubmissions();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener tus resultados');
    }
  }

  static async getMySubmission(submissionId) {
    if (!submissionId) throw new AppError('El ID de la entrega es obligatorio');
    try {
      return await ExamAPI.getMySubmission(submissionId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener el resultado');
    }
  }

  // gradeData: { questionGrades: [{questionId, score, feedback}], totalScore, teacherFeedback }
  static async gradeSubmission(examId, submissionId, gradeData) {
    if (!examId) throw new AppError('El ID del examen es obligatorio');
    if (!submissionId) throw new AppError('El ID de la entrega es obligatorio');
    if (gradeData.totalScore == null) throw new AppError('La calificación total es obligatoria');
    if (gradeData.totalScore < 0) throw new AppError('La calificación no puede ser negativa');
    try {
      return await ExamAPI.gradeSubmission(examId, submissionId, gradeData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al calificar la entrega');
    }
  }
}

export default SubmissionService;
