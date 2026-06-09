import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Maneja el cronómetro del examen.
 * - Si durationMinutes > 0: cuenta regresiva. onTimeUp se llama al llegar a 0.
 * - Si no: cronómetro hacia adelante.
 * - initialElapsed: segundos ya transcurridos (para recuperar tras un reload)
 */
export function useExamTimer({ durationMinutes = null, enabled = true, onTimeUp, initialElapsed = 0 } = {}) {
  const hasLimit = durationMinutes > 0;
  const totalSeconds = hasLimit ? durationMinutes * 60 : 0;

  const [elapsed, setElapsed] = useState(initialElapsed); // seconds elapsed
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!enabled) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (hasLimit && next >= totalSeconds && !expired) {
          clearInterval(intervalRef.current);
          setExpired(true);
          onTimeUpRef.current?.();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [enabled, hasLimit, totalSeconds, expired]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const remaining = hasLimit ? Math.max(0, totalSeconds - elapsed) : null;
  const display = hasLimit ? remaining : elapsed;
  const isWarning = hasLimit && remaining !== null && remaining <= 300 && remaining > 0; // últimos 5 min
  const isDanger = hasLimit && remaining !== null && remaining <= 60 && remaining > 0;  // último min

  const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    displayTime: fmt(display ?? elapsed),
    elapsed,
    remaining,
    expired,
    isWarning,
    isDanger,
    hasLimit,
    stop,
  };
}
