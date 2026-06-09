import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook que devuelve una función para volver atrás de manera consistente.
 *
 * - Si hay historial de navegación dentro de la app (la entrada actual NO es la inicial),
 *   retrocede una posición usando `navigate(-1)`. Esto preserva el contexto del lugar
 *   real desde donde el usuario llegó (ej: lista filtrada, paginación, scroll).
 * - Si la pantalla se abrió directamente (deep link, refresh, nueva pestaña), navega
 *   al `fallbackPath` provisto.
 *
 * @param {string} fallbackPath - Ruta a la que ir si no hay historial previo.
 * @returns {() => void}
 */
export function useGoBack(fallbackPath) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    // location.key === 'default' indica que es la primera entrada del historial
    // (no hubo navegación previa dentro de la SPA).
    const hasHistory = location.key && location.key !== 'default';
    if (hasHistory) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  }, [navigate, location.key, fallbackPath]);
}

