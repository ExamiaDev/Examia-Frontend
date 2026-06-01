/**
 * Exam - Modelo de dominio para exámenes
 *
 * Representa um examen con todas sus propiedades y estado
 */
export class Exam {
  constructor(id, nombre, descripcion, curso, turno, puntajeTotal, preguntas, estado = 'borrador', createdAt, updatedAt) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.curso = curso;
    this.turno = turno;
    this.puntajeTotal = puntajeTotal;
    this.preguntas = preguntas; // Array de preguntas
    this.estado = estado; // 'borrador', 'publicado', 'activo', 'finalizado'
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Verificar si el examen está en estado de borrador
   */
  isDraft() {
    return this.estado === 'borrador';
  }

  /**
   * Verificar si el examen está publicado
   */
  isPublished() {
    return this.estado === 'publicado';
  }

  /**
   * Verificar si el examen está activo (en progreso)
   */
  isActive() {
    return this.estado === 'activo';
  }

  /**
   * Obtener cantidad de preguntas
   */
  getQuestionCount() {
    return this.preguntas ? this.preguntas.length : 0;
  }

  /**
   * Obtener puntaje total de todas las preguntas
   */
  getTotalPoints() {
    if (!this.preguntas || this.preguntas.length === 0) {
      return 0;
    }
    return this.preguntas.reduce((sum, q) => sum + (q.puntaje || 0), 0);
  }

  /**
   * Verificar si el puntaje total es válido
   */
  isPointsValid() {
    return this.getTotalPoints() === this.puntajeTotal;
  }
}

/**
 * ExamQuestion - Modelo de dominio para preguntas de examen
 */
export class ExamQuestion {
  constructor(id, tipo, enunciado, puntaje, opciones = null, respuestaCorrecta = null, columnas = null, filas = null) {
    this.id = id;
    this.tipo = tipo; // 'texto-libre', 'tabla', 'arbol-decision', 'multiple-choice'
    this.enunciado = enunciado;
    this.puntaje = puntaje;
    this.opciones = opciones; // Para multiple-choice
    this.respuestaCorrecta = respuestaCorrecta; // Para corrección automática
    this.columnas = columnas; // Para tabla
    this.filas = filas; // Para tabla
  }

  /**
   * Verificar si es pregunta de múltiple choice
   */
  isMultipleChoice() {
    return this.tipo === 'multiple-choice';
  }

  /**
   * Verificar si es pregunta de texto libre
   */
  isFreeText() {
    return this.tipo === 'texto-libre';
  }

  /**
   * Verificar si es tabla
   */
  isTable() {
    return this.tipo === 'tabla';
  }

  /**
   * Verificar si es matriz
   */
  isMatrix() {
    return this.tipo === 'tabla';
  }

  /**
   * Verificar si es árbol de decisión
   */
  isDecisionTree() {
    return this.tipo === 'arbol-decision';
  }

  /**
   * Obtener opciones para múltiple choice
   */
  getOptions() {
    return this.opciones || [];
  }
}

/**
 * ExamResponse - Modelo de dominio para respuestas de exámenes
 */
export class ExamResponse {
  constructor(id, examId, userId, respuestas, estado = 'en-progreso', calificacion = null, createdAt, updatedAt) {
    this.id = id;
    this.examId = examId;
    this.userId = userId;
    this.respuestas = respuestas; // Array de respuestas por pregunta
    this.estado = estado; // 'en-progreso', 'entregado', 'calificado'
    this.calificacion = calificacion; // Calificación final (0-10)
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Verificar si está en progreso
   */
  isInProgress() {
    return this.estado === 'en-progreso';
  }

  /**
   * Verificar si fue entregado
   */
  isSubmitted() {
    return this.estado === 'entregado';
  }

  /**
   * Verificar si fue calificado
   */
  isGraded() {
    return this.estado === 'calificado' && this.calificacion !== null;
  }

  /**
   * Obtener cantidad de respuestas
   */
  getResponseCount() {
    return this.respuestas ? this.respuestas.length : 0;
  }

  /**
   * Marcar como entregado
   */
  markAsSubmitted() {
    this.estado = 'entregado';
  }

  /**
   * Marcar como calificado
   */
  markAsGraded(calificacion) {
    this.estado = 'calificado';
    this.calificacion = calificacion;
  }
}

export default Exam;

