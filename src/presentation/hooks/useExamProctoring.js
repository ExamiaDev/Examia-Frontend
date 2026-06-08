import { useState, useEffect, useCallback, useRef } from 'react';

export const VIOLATION_LABELS = {
  tab_switch:  'Cambio de pestaña',
  window_blur: 'Cambio de ventana / Alt+Tab',
  page_reload: 'Recarga / cierre de página',
};

const lsViolationsKey = (examId) => `examia_exam_${examId}_violations`;

const loadSavedViolations = (examId) => {
  try {
    const raw = localStorage.getItem(lsViolationsKey(examId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const persistViolations = (examId, violations) => {
  try { localStorage.setItem(lsViolationsKey(examId), JSON.stringify(violations)); } catch (error) { void error; }
};

export const clearSavedViolations = (examId) => {
  try { localStorage.removeItem(lsViolationsKey(examId)); } catch (error) { void error; }
};

const getIsFullscreen = () => !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);

export const enterFullscreen = () => {
  const el = document.documentElement;
  const fn = el.requestFullscreen || el.webkitRequestFullscreen ||
              el.mozRequestFullScreen || el.msRequestFullscreen;
  return fn ? fn.call(el) : Promise.reject(new Error('Fullscreen no soportado'));
};

export function useExamProctoring({ enabled = true, examId = null } = {}) {
  const [violations, setViolations] = useState(() =>
    examId ? loadSavedViolations(examId) : []
  );
  const [warningOpen, setWarningOpen] = useState(false);
  const [lastViolation, setLastViolation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(getIsFullscreen);
  const [fullscreenExitOpen, setFullscreenExitOpen] = useState(false);
  const pendingBlur = useRef(null);
  const violationsRef = useRef(violations);
  violationsRef.current = violations;

  const addViolation = useCallback((type) => {
    const v = { type, label: VIOLATION_LABELS[type] ?? type, timestamp: new Date().toISOString() };
    setViolations((prev) => {
      const next = [...prev, v];
      if (examId) persistViolations(examId, next);
      return next;
    });
    setLastViolation(v);
    // page_reload no muestra dialog (la página ya recargó); fullscreen_exit tiene su propio dialog
    if (type !== 'page_reload' && type !== 'fullscreen_exit') setWarningOpen(true);
  }, [examId]);

  // Bloquear botón back del browser
  useEffect(() => {
    if (!enabled) return;
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);

  // Detectar salida de pantalla completa
  useEffect(() => {
    if (!enabled) return;
    const handleFsChange = () => {
      const fs = getIsFullscreen();
      setIsFullscreen(fs);
      if (!fs) {
        addViolation('fullscreen_exit');
        setFullscreenExitOpen(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, [enabled, addViolation]);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (pendingBlur.current) {
          clearTimeout(pendingBlur.current);
          pendingBlur.current = null;
        }
        addViolation('tab_switch');
      }
    };

    const handleBlur = () => {
      pendingBlur.current = setTimeout(() => {
        pendingBlur.current = null;
        if (!document.hidden) addViolation('window_blur');
      }, 300);
    };

    const handleBeforeUnload = (e) => {
      if (examId) {
        const v = { type: 'page_reload', label: VIOLATION_LABELS.page_reload, timestamp: new Date().toISOString() };
        persistViolations(examId, [...violationsRef.current, v]);
      }
      e.preventDefault();
      e.returnValue = 'Estás realizando un examen. Si salís, tu progreso puede perderse.';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (pendingBlur.current) clearTimeout(pendingBlur.current);
    };
  }, [enabled, addViolation, examId]);

  const dismissWarning = useCallback(() => setWarningOpen(false), []);

  const reEnterFullscreen = useCallback(() => {
    enterFullscreen()
      .then(() => setFullscreenExitOpen(false))
      .catch(() => {});
  }, []);

  const violationsPayload = violations.map(({ type, timestamp }) => ({ type, timestamp }));

  return {
    violations,
    violationCount: violations.length,
    violationsPayload,
    warningOpen,
    lastViolation,
    dismissWarning,
    isFullscreen,
    fullscreenExitOpen,
    reEnterFullscreen,
  };
}
