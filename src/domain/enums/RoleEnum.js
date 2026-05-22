/**
 * Role Enum
 * Define the available user roles in the system
 */

export const RoleEnum = {
  DOCENTE: 'DOCENTE',
  ALUMNO: 'ALUMNO',
};

/**
 * Get role display name
 * @param {string} role - The role value
 * @returns {string} The display name for the role
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [RoleEnum.DOCENTE]: 'Docente',
    [RoleEnum.ALUMNO]: 'Alumno',
  };
  return displayNames[role] || role;
};

/**
 * Check if a value is a valid role
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid role
 */
export const isValidRole = (value) => {
  return Object.values(RoleEnum).includes(value);
};

