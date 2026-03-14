export interface FeatureCard {
  id: number;
  icon: string;
  title: string;
  content: string;
}

export const featureCards: FeatureCard[] = [
  {
    id: 1,
    icon: 'fa-solid fa-building-shield',
    title: 'Multi-Tenant Architecture',
    content:
      'Each institution gets its own isolated workspace with custom branding and configuration.',
  },
  {
    id: 2,
    icon: 'fa-solid fa-user-shield',
    title: 'Role-Based Access',
    content: 'Super Admin, College Admin, Instructor, and Student — each with tailored dashboards.',
  },
  {
    id: 3,
    icon: 'fa-solid fa-database',
    title: 'Smart Question Bank',
    content: 'Build reusable question pools with tagging, difficulty levels, and auto-shuffle.',
  },
  {
    id: 4,
    icon: 'fa-solid fa-chart-line',
    title: 'Real-Time Analytics',
    content: 'Track performance with detailed reports, charts, and exportable data at every level.',
  },
  {
    id: 5,
    icon: 'fa-solid fa-lock',
    title: 'Secure Assessments',
    content: 'Anti-cheating measures, time limits, randomized questions, and secure browser mode.',
  },
  {
    id: 6,
    icon: 'fa-solid fa-check-double',
    title: 'Instant Grading',
    content: 'Automatic scoring with customizable rubrics and instant result publishing.',
  },
];
