import { PrismaClient, CATEGORY_TYPE } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categoryLabels: Record<CATEGORY_TYPE, string[]> = {
    PARENTING_SKILLS_RELATIONSHIPS: [
      'Positive Discipline',
      'Co-Parenting & Communication',
      'Building Emotional Connection',
      'Parenting Styles & Strategies',
      'Family Dynamics & Conflict Resolution',
    ],
    CHILD_DEVELOPMENT: [
      'Cognitive Development',
      'Emotional & Social Development',
      'Physical & Motor Development',
      'Milestones & Early Learning',
    ],
    MENTAL_EMOTIONAL_HEALTH: [
      'Child Mental Health',
      'Parent Mental Wellness',
      'Stress & Anxiety Management',
      'Self-Esteem & Confidence Building',
      'Trauma-Informed Parenting',
    ],
    SAFETY_PROTECTION: [
      'Child Abuse Prevention',
      'Internet & Media Safety',
      'Bullying & Peer Pressure',
      'Domestic Violence Awareness',
      'Crisis Helplines & Hotlines',
    ],
    EDUCATION_LEARNING: [
      'Academic Support & Tutoring',
      'Early Childhood Education',
      'Learning Disabilities & Special Needs',
      'Homework & Study Habits',
      'Reading & Language Development',
    ],
    HEALTH_WELLBEING: [
      'Nutrition & Healthy Eating',
      'Sleep & Routines',
      'Physical Activity & Sports',
      'Pediatric Health Basics',
      'Substance Use Prevention',
    ],
    LIFE_SKILLS_INDEPENDENCE: [
      'Emotional Regulation for Kids',
      'Social Skills Development',
      'Decision-Making & Problem Solving',
      'Responsibility & Chores',
      'Preparing for Adolescence',
    ],
    FAMILY_SUPPORT_COMMUNITY: [
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


  // Add the Digital Safety Toolkit resource
  const digitalSafetyResource = await prisma.resource.upsert({
    where: { title: 'Family Digital Safety Toolkit – American SPCC' },
    update: {},
    create: {
      title: 'Family Digital Safety Toolkit – American SPCC',
      description:
        'A comprehensive toolkit by American SPCC to help parents and caregivers keep children safe online. It provides guidance on screen time, app usage, social media boundaries, and fostering open communication about digital habits.',
      resource_type: 'PDF',
      hosting_type: 'EXTERNAL',
      category: 'SAFETY_PROTECTION',
      age_groups: ['AGE_10_13', 'AGE_14_18'],
      language: 'ENGLISH',
      time_to_read: 20,
      externalResources: {
        create: {
          external_url:
            'https://americanspcc.org/wp-content/uploads/2025/06/AmericanSPCC-Digital-Safety-Toolkit.pdf',
        },
      },
    },
  });

  const digitalSafetyLabels = await prisma.categoryLabel.findMany({
    where: {
      label_name: {
        in: ['Internet & Media Safety', 'Bullying & Peer Pressure'],
      },
    },
  });

  for (const label of digitalSafetyLabels) {
    await prisma.resourceLabel.upsert({
      where: {
        resource_id_label_id: {
          resource_id: digitalSafetyResource.id,
          label_id: label.id,
        },
      },
      update: {},
      create: { resource_id: digitalSafetyResource.id, label_id: label.id },
    });
  }

}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
