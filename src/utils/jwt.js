/**
 * JWT Utilities
 * Helpers para inspeccionar tokens JWT en el cliente (solo debug, no validación)
 */

/**
 * Decodifica el payload de un JWT sin validar su firma.
 * Devuelve null si el token es inválido.
 */
export const decodeJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    console.warn('[JWT] No se pudo decodificar el token:', err);
    return null;
  }
};

/**
 * Logs útiles sobre el token guardado (solo en desarrollo).
 */
export const debugJwt = (token, label = 'Token') => {
  const payload = decodeJwt(token);
  if (!payload) {
    console.warn(`[JWT] ${label}: payload inválido o no es un JWT`);
    return;
  }
  console.log(`[JWT] ${label} payload:`, payload);
  if (!payload.sub) {
    console.warn(`[JWT] ${label}: el claim "sub" está vacío (el backend no podrá identificar al usuario)`);
  }
};

