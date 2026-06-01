export const courses = [
  {
    id: 1,
    subjectId: '1',
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 32,
    shift: 'Mañana',
    shiftColor: '#001f56',
  },
  {
    id: 2,
    subjectId: '2',
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 28,
    shift: 'Tarde',
    shiftColor: '#0369a1',
  },
  {
    id: 3,
    subjectId: '3',
    name: 'Testing de Aplicaciones',
    year: '2026',
    grade: '1C',
    students: 41,
    shift: 'Noche',
    shiftColor: '#374151',
  },
];

export const getCourseById = (courseId) =>
  courses.find((course) => String(course.id) === String(courseId));
