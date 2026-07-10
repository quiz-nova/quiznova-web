// these are the seeded credentials that exist in the backend seed data
export const SeededCredentials = {
  admin: {
    email: 'admin@quiznova.local',
    password: 'Admin123!',
    role: 'Admin',
    name: 'Admin User',
  },
  instructor: {
    email: 'ahmed.nasser@quiznova.local',
    password: 'Instructor123!',
    role: 'Instructor',
    name: 'Dr. Ahmed Nasser',
  },
  student: {
    email: 'omar.yasser@quiznova.local',
    password: 'Student123!',
    role: 'Student',
    name: 'Omar Yasser',
  },
} as const;
