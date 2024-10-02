import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  '',
  'Master Machine Learning in 100 Days',
  'Basic: Chinese Literature',
  'Linear Algebra: A Comprehensive View',
  'Creating Dashboards and Storytelling with Tableau',
  'Poverty & Population: How Demographics Shape Policy',
  'Advanced Neurobiology I',
  'Types of Conflict',
  'Creating Dashboards and Storytelling with Tableau',
  'Poverty & Population: How Demographics Shape Policy',
  'Advanced Neurobiology I',
  'Types of Conflict',
];

const POST_TITLES_H = [
  '',
  'Beginner',
  'Advanced',
  'Intermediate',
  'Beginner',
  'Advanced',
  'Intermediate',
  'Beginner',
  'Advanced',
  'Intermediate',
  'Beginner',
  'Advanced',
];

const POST_TITLES_P = [
  '',
  'The University of Sydney',
  'The University of Sydney',
  'Emory University',
  'University of Colorado System',
  'Rice University',
  'University of Michigan',
  'University of Colorado System',
  'University of Colorado Boulder',
  'Duke University',
  'University of Colorado Boulder',
  'Emory University',
];

export const posts = [...Array(11)].map((_, index) => ({
  id: faker.string.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  provider: POST_TITLES_P[index + 1],
  view: faker.number.int(99999),
  comment: faker.number.int(99999),
  share: faker.number.int(99999),
  difficulty: POST_TITLES_H[index + 1],
  rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
  favorite: faker.number.int(99999),
  author: {
    name: faker.person.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));
