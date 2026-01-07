import {
  PrismaClient,
  CATEGORY_TYPE,
  RESOURCE_TYPE,
  HOSTING_TYPE,
  LANGUAGE,
  AGE_GROUP,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categoryLabels: Record<CATEGORY_TYPE, string[]> = {
    [CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS]: [
      'Positive Discipline',
      'Co-Parenting & Communication',
      'Building Emotional Connection',
      'Parenting Styles & Strategies',
      'Family Dynamics & Conflict Resolution',
    ],
    [CATEGORY_TYPE.CHILD_DEVELOPMENT]: [
      'Cognitive Development',
      'Emotional & Social Development',
      'Physical & Motor Development',
      'Milestones & Early Learning',
    ],
    [CATEGORY_TYPE.MENTAL_EMOTIONAL_HEALTH]: [
      'Child Mental Health',
      'Parent Mental Wellness',
      'Stress & Anxiety Management',
      'Self-Esteem & Confidence Building',
      'Trauma-Informed Parenting',
    ],
    [CATEGORY_TYPE.SAFETY_PROTECTION]: [
      'Child Abuse Prevention',
      'Internet & Media Safety',
      'Bullying & Peer Pressure',
      'Domestic Violence Awareness',
      'Crisis Helplines & Hotlines',
    ],
    [CATEGORY_TYPE.EDUCATION_LEARNING]: [
      'Academic Support & Tutoring',
      'Early Childhood Education',
      'Learning Disabilities & Special Needs',
      'Homework & Study Habits',
      'Reading & Language Development',
    ],
    [CATEGORY_TYPE.HEALTH_WELLBEING]: [
      'Nutrition & Healthy Eating',
      'Sleep & Routines',
      'Physical Activity & Sports',
      'Pediatric Health Basics',
      'Substance Use Prevention',
    ],
    [CATEGORY_TYPE.LIFE_SKILLS_INDEPENDENCE]: [
      'Emotional Regulation for Kids',
      'Social Skills Development',
      'Decision-Making & Problem Solving',
      'Responsibility & Chores',
      'Preparing for Adolescence',
    ],
    [CATEGORY_TYPE.FAMILY_SUPPORT_COMMUNITY]: [
      'Local Programs & Workshops',
      'Parenting Groups & Networks',
      'Financial Assistance & Family Aid',
      'Legal & Custody Resources',
      'Community Health Services',
    ],
  };

  for (const [category, labels] of Object.entries(categoryLabels)) {
    for (const label_name of labels) {
      await prisma.categoryLabel.upsert({
        where: { label_name },
        update: {},
        create: {
          label_name,
          category: category as CATEGORY_TYPE,
        },
      });
    }
  }}

  main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
