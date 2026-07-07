// these are the seeded credentials that exist in the backend seed data
export const SeededCredentials = {
  admin: {
    email: 'admin@quiznova.local',
    password: 'Admin123!',
    role: 'Admin',
    name: 'Admin User',
  },
  instructor: {
    email: 'instructor1@quiznova.local',
    password: 'Instructor123!',
    role: 'Instructor',
    name: 'Instructor One',
  },
  student: {
    email: 'student1@quiznova.local',
    password: 'Student123!',
    role: 'Student',
    name: 'Student One',
  },
} as const;
