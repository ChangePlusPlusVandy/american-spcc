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
  }

  // Seed external URLs for featured "Getting Started" resources
  const featuredResourceUrls: { title: string; url: string }[] = [
    { title: 'Take the ACEs Quiz', url: 'https://americanspcc.org/take-the-aces-quiz' },
    { title: 'Positive Childhood Experiences', url: 'https://americanspcc.org/positive-childhood-experience' },
    { title: 'What Is Positive Parenting?', url: 'https://americanspcc.org/positive-parenting/' },
    { title: 'What Is Positive Discipline?', url: 'https://americanspcc.org/what-is-positive-discipline/' },
    { title: 'Coregulation', url: 'https://americanspcc.org/coregulation/' },
    { title: 'Take the PCEs Quiz', url: 'https://americanspcc.org/take-the-pces-quiz/' },
  ];

  for (const { title, url } of featuredResourceUrls) {
    // Find the resource by title
    const resource = await prisma.resource.findUnique({
      where: { title },
    });

    if (resource) {
      // Upsert the external URL (create if not exists, update if exists)
      await prisma.externalResources.upsert({
        where: { resource_fk: resource.id },
        update: { external_url: url },
        create: {
          resource_fk: resource.id,
          external_url: url,
        },
      });
      console.log(`✓ Added external URL for: ${title}`);
    } else {
      console.log(`✗ Resource not found: ${title}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
