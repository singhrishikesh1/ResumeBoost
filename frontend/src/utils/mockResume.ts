import type { ResumeData } from './atsEngine';

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Rishikesh Singh',
    email: 'itsrishikeshsingh1@gmail.com',
    phone: '+1 (555) 019-2834',
    website: 'https://github.com/singhrishikesh1',
    location: 'San Francisco, CA'
  },
  summary: 'Passionate Frontend Software Engineer with 2+ years of experience building responsive, highly performing web applications. Skilled in React, TypeScript, and modern CSS layout engines. Adept at collaborating with cross-functional teams to engineer elegant visual interfaces and optimize rendering performance.',
  experience: [
    {
      id: 'exp-1',
      company: 'TechSolutions Inc.',
      role: 'Frontend Engineer',
      duration: '2024 - Present',
      bullets: [
        'Developed interactive analytics dashboards using React and TypeScript, boosting client engagement by 35%.',
        'Optimized core application rendering paths to reduce Largest Contentful Paint (LCP) by 800ms.',
        'Collaborated with designers to build a shared modular component library using clean, responsive Vanilla CSS.',
        'Led a team of 3 junior developers to integrate third-party payment gateways and state management flows.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Innovate Labs',
      role: 'Web Developer Intern',
      duration: '2023 - 2024',
      bullets: [
        'Built landing pages and email newsletter systems with clean semantics, improving lead conversion by 12%.',
        'Maintained core responsive grids and debugged layout rendering bottlenecks across mobile Safari and Chrome.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'State Tech University',
      degree: 'B.S. in Computer Science',
      duration: '2020 - 2024',
      bullets: [
        'Graduated with Honors; Focus on Web Architectures and Human-Computer Interaction.',
        'Core coursework: Advanced Algorithms, Database Systems, Software Engineering Methodologies.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AssetFlow Dashboard',
      role: 'Creator & Lead Developer',
      bullets: [
        'Engineered a complete financial tracking app utilizing React context API and custom hooks for smooth rendering.',
        'Implemented fully responsive charts, responsive themes, and SVG data graphics with zero dependencies.'
      ]
    }
  ],
  skills: [
    'React',
    'TypeScript',
    'JavaScript (ES6+)',
    'HTML5 & CSS3',
    'Vite',
    'Git & GitHub',
    'Responsive Design',
    'Performance Optimization',
    'REST APIs',
    'Vanilla CSS'
  ]
};

export const initialJobDescription = `
Senior Frontend Engineer

Role Description:
We are looking for a skilled Senior Frontend Engineer to lead development on our web applications. In this role, you will build interactive features using React and TypeScript, optimize loading metrics and performance (LCP, Core Web Vitals), and lead architectural layouts.

Key Requirements:
- Strong experience with React, TypeScript, and modern build tooling like Vite.
- Deep understanding of CSS layout structures, responsive web design, and clean web architecture.
- Ability to lead junior developers and collaborate with design teams.
- Knowledge of performance optimization, state management, and REST APIs.
- Experience with testing, deployment pipelines, and Git version control.
`;
