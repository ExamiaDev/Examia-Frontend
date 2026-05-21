/**
 * Shared Form Styles and Constants
 * Elimina duplicación de estilos entre componentes de formulario
 */

// Estilos comunes para labels de formularios
export const labelSx = {
  color: '#001f56',
  fontWeight: 600,
  fontSize: '0.9rem',
  display: 'block',
  mb: 0.8,
};

// Estilos para botones de navegación (volver, etc)
export const backButtonSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  color: '#666',
  fontSize: '0.85rem',
  mb: 2,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

// Estilos para botones principales (submit)
export const primaryButtonSx = {
  mt: 0.5,
  mb: 2,
  backgroundColor: '#001f56',
  fontWeight: 600,
  padding: '10px',
  fontSize: '1rem',
  '&:hover': { backgroundColor: '#000d2b' },
};

// Estilos para botones principales con estado deshabilitado visible
export const primaryButtonDisabledSx = {
  ...primaryButtonSx,
  '&.Mui-disabled': { backgroundColor: '#8fa3cc', color: '#fff' },
};

// Estilos para botones secundarios
export const secondaryButtonSx = {
  mb: 2,
  color: '#001f56',
  borderColor: '#e0e0e0',
  backgroundColor: '#f5f5f5',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '10px',
  textTransform: 'none',
  '&:hover': { backgroundColor: '#ebebeb', borderColor: '#c0c0c0' },
};

// Estilos para footer/hints
export const footerSx = {
  textAlign: 'center',
  color: '#888',
  fontSize: '0.75rem',
};

