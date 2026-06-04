import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#001f56', mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

export default function TermsAndConditionsModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#001f56', pb: 1 }}>
        Términos y Condiciones de Uso
        <Typography variant="caption" display="block" sx={{ color: '#888', fontWeight: 400, mt: 0.5 }}>
          Última actualización: junio de 2026
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>

        <Section title="1. Aceptación de los términos">
          Al registrarte y utilizar Examia, aceptás cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo con alguna de las condiciones aquí establecidas, no debés utilizar la plataforma.
        </Section>

        <Section title="2. Descripción del servicio">
          Examia es una plataforma educativa digital destinada a la creación, administración y realización de evaluaciones académicas en el ámbito de la Universidad Argentina de la Empresa (UADE). El acceso está restringido a alumnos y docentes debidamente registrados.
        </Section>

        <Section title="3. Registro y credenciales">
          Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso (email y contraseña). Queda prohibido compartir, ceder o transferir el acceso a la cuenta a terceros. Cualquier actividad realizada desde tu cuenta es de tu exclusiva responsabilidad.
        </Section>

        <Section title="4. Integridad académica">
          El uso de Examia está sujeto a las normas de integridad académica de la institución. Queda estrictamente prohibido: utilizar medios no autorizados durante las evaluaciones, compartir el contenido de exámenes con otros usuarios, suplantar la identidad de otro alumno o docente, y utilizar herramientas de asistencia externas durante evaluaciones en línea. El incumplimiento puede derivar en sanciones académicas según el reglamento institucional vigente.
        </Section>

        <Section title="5. Propiedad intelectual">
          Todo el contenido publicado en Examia — incluyendo exámenes, consignas, materiales y recursos didácticos — es propiedad de la institución o de los docentes que lo crearon. Está prohibida su reproducción, distribución o uso fuera del contexto académico sin autorización expresa.
        </Section>

        <Section title="6. Privacidad y tratamiento de datos">
          Los datos personales recopilados durante el registro (nombre, apellido, email, legajo) son utilizados exclusivamente para la gestión de la cuenta y el seguimiento académico. No serán compartidos con terceros ajenos a la institución. Al registrarte, aceptás el tratamiento de tus datos conforme a la Ley N.º 25.326 de Protección de Datos Personales de la República Argentina.
        </Section>

        <Section title="7. Disponibilidad del servicio">
          Examia se esfuerza por mantener el servicio disponible de forma continua, pero no garantiza disponibilidad ininterrumpida. El equipo de desarrollo podrá realizar tareas de mantenimiento que impliquen interrupciones temporales, notificando con anticipación cuando sea posible.
        </Section>

        <Section title="8. Conducta del usuario">
          El uso de la plataforma debe ser responsable y respetuoso. Está prohibido realizar acciones que comprometan la seguridad del sistema, interferir con el acceso de otros usuarios, o intentar acceder a información que no te corresponde según tu rol.
        </Section>

        <Section title="9. Modificaciones">
          Examia se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la plataforma. El uso continuado del servicio implica la aceptación de las nuevas condiciones.
        </Section>

        <Section title="10. Contacto">
          Para consultas relacionadas con estos términos, podés comunicarte con el equipo de soporte a través de los canales habilitados por la institución.
        </Section>

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
