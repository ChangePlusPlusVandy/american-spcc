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

  const childrensMentalDisorders = await prisma.resource.upsert({
    where: {
      title: "Children's Mental Disorders – American SPCC",
    },
    update: {},
    create: {
      title: "Children's Mental Disorders – American SPCC",
      description:
        'A comprehensive overview of common childhood mental disorders, including symptoms, risk factors, diagnosis, and early intervention strategies to support children’s emotional and behavioral wellbeing.',

      resource_type: RESOURCE_TYPE.WEBPAGE,
      hosting_type: HOSTING_TYPE.EXTERNAL,
      category: CATEGORY_TYPE.MENTAL_EMOTIONAL_HEALTH,

      age_groups: [AGE_GROUP.AGE_4_6, AGE_GROUP.AGE_7_10, AGE_GROUP.AGE_10_13, AGE_GROUP.AGE_14_18],

      language: LANGUAGE.ENGLISH,
      time_to_read: 18,

      externalResources: {
        create: {
          external_url: 'https://americanspcc.org/childrens-mental-disorders/',
        },
      },
    },
  });

  const disorderLabels = await prisma.categoryLabel.findMany({
    where: {
      label_name: {
        in: [
          'Child Mental Health',
          'Emotional & Social Development',
          'Stress & Anxiety Management',
          'Trauma-Informed Parenting',
        ],
      },
    },
  });

  for (const label of disorderLabels) {
    await prisma.resourceLabel.upsert({
      where: {
        resource_id_label_id: {
          resource_id: childrensMentalDisorders.id,
          label_id: label.id,
        },
      },
      update: {},
      create: {
        resource_id: childrensMentalDisorders.id,
        label_id: label.id,
      },
    });
  }

  const childrensMentalHealth = await prisma.resource.upsert({
    where: {
      title: "Children's Mental Health – American SPCC",
    },
    update: {},
    create: {
      title: "Children's Mental Health – American SPCC",
      description:
        'An overview of children’s mental health, including common emotional and behavioral challenges, early warning signs, resilience building, and how parents can support healthy emotional development.',

      resource_type: RESOURCE_TYPE.WEBPAGE,
      hosting_type: HOSTING_TYPE.EXTERNAL,
      category: CATEGORY_TYPE.MENTAL_EMOTIONAL_HEALTH,

      age_groups: [AGE_GROUP.AGE_4_6, AGE_GROUP.AGE_7_10, AGE_GROUP.AGE_10_13, AGE_GROUP.AGE_14_18],

      language: LANGUAGE.ENGLISH,
      time_to_read: 15,

      externalResources: {
        create: {
          external_url: 'https://americanspcc.org/childrens-mental-health/',
        },
      },
    },
  });

  const childrenMentalHealthLabels = await prisma.categoryLabel.findMany({
    where: {
      label_name: {
        in: [
          'Child Mental Health',
          'Emotional & Social Development',
          'Stress & Anxiety Management',
          'Self-Esteem & Confidence Building',
        ],
      },
    },
  });

  for (const label of childrenMentalHealthLabels) {
    await prisma.resourceLabel.upsert({
      where: {
        resource_id_label_id: {
          resource_id: childrensMentalHealth.id,
          label_id: label.id,
        },
      },
      update: {},
      create: {
        resource_id: childrensMentalHealth.id,
        label_id: label.id,
      },
    });
  }

  const digitalSafetyResource = await prisma.resource.upsert({
    where: {
      title: 'Family Digital Safety Toolkit – American SPCC',
    },
    update: {},
    create: {
      title: 'Family Digital Safety Toolkit – American SPCC',
      description:
        'A comprehensive toolkit by American SPCC to help parents and caregivers keep children safe online. It provides guidance on screen time, app usage, social media boundaries, and fostering open communication about digital habits.',

      resource_type: RESOURCE_TYPE.PDF,
      hosting_type: HOSTING_TYPE.EXTERNAL,
      category: CATEGORY_TYPE.SAFETY_PROTECTION,

      age_groups: [AGE_GROUP.AGE_10_13, AGE_GROUP.AGE_14_18],
      language: LANGUAGE.ENGLISH,
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
      create: {
        resource_id: digitalSafetyResource.id,
        label_id: label.id,
      },
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
