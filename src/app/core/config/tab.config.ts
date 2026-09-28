import { TRANSLATION_TOKENS } from '@Core/config/language.config';

export const TAB_ICONS: Record<string, string> = {
  Dashboard: 'fa-solid fa-gauge',
  'My Courses': 'fa-solid fa-book-open',
  'Create Quiz': 'fa-solid fa-pen-to-square',
  'Question Bank': 'fa-solid fa-database',
  'Assign Quiz': 'fa-solid fa-clipboard-list',
  'View Results': 'fa-solid fa-eye',
  Quizzes: 'fa-solid fa-file-lines',
  'Quiz Attempts': 'fa-solid fa-list-check',
  Results: 'fa-solid fa-square-poll-vertical',
  Instructors: 'fa-solid fa-chalkboard-user',
  Students: 'fa-solid fa-users',
  Courses: 'fa-solid fa-book',
  Admins: 'fa-solid fa-user-shield',
  Settings: 'fa-solid fa-gear',
  'Pending Grades': 'fa-solid fa-clipboard-check',
  'Course Chat': 'fa-solid fa-comments',
};

export const TAB_TRANSLATION_KEYS: Record<string, string> = {
  Dashboard: TRANSLATION_TOKENS.NAV.DASHBOARD,
  'My Courses': TRANSLATION_TOKENS.NAV.MY_COURSES,
  'Create Quiz': TRANSLATION_TOKENS.NAV.CREATE_QUIZ,
  'Pending Grades': TRANSLATION_TOKENS.NAV.PENDING_GRADES,
  'Course Chat': TRANSLATION_TOKENS.NAV.COURSE_CHAT,
  Quizzes: TRANSLATION_TOKENS.NAV.QUIZZES,
  Results: TRANSLATION_TOKENS.NAV.RESULTS,
  Instructors: TRANSLATION_TOKENS.NAV.INSTRUCTORS,
  Students: TRANSLATION_TOKENS.NAV.STUDENTS,
  Courses: TRANSLATION_TOKENS.NAV.COURSES,
  'Quiz Attempts': TRANSLATION_TOKENS.NAV.QUIZ_ATTEMPTS,
  Admins: TRANSLATION_TOKENS.NAV.ADMINS,
  Settings: TRANSLATION_TOKENS.NAV.SETTINGS,
};
