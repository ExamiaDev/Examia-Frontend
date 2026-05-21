/**
 * Domain Models
 */

import { RoleEnum } from '../enums/RoleEnum.js';

export class User {
  constructor(id, username, email, role = RoleEnum.ALUMNO, createdAt, updatedAt) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role; // PROFESOR o ALUMNO
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class AuthResponse {
  constructor(success, message, data = null, error = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}

