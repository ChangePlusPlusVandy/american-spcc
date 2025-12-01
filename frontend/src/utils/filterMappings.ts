// Maps user-friendly filter labels to backend Prisma enum values

export const TOPIC_TO_CATEGORY: Record<string, string> = {
  'Parenting Skills & Relationships': 'PARENTING_SKILLS_RELATIONSHIPS',
  'Mental & Emotional Health': 'MENTAL_EMOTIONAL_HEALTH',
  'Life Skills & Independence': 'LIFE_SKILLS_INDEPENDENCE',
  'Child Development': 'CHILD_DEVELOPMENT',
  'Education & Learning': 'EDUCATION_LEARNING',
  'Family Supports & Community': 'FAMILY_SUPPORT_COMMUNITY',
  'Health & Wellbeing': 'HEALTH_WELLBEING',
  'Safety & Protection': 'SAFETY_PROTECTION',
};

export const AGE_TO_ENUM: Record<string, string> = {
  'Infant (0–1)': 'AGE_0_3',
  'Preschool (3–6)': 'AGE_4_6',
  'Elementary (7–10)': 'AGE_7_10',
  'Middle School (11–13)': 'AGE_10_13',
  'High School (14–18)': 'AGE_14_18',
  'University & Above (18+)': 'AGE_18_ABOVE',
};

export const CATEGORY_TO_TOPIC: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: 'Parenting Skills & Relationships',
  MENTAL_EMOTIONAL_HEALTH: 'Mental & Emotional Health',
  LIFE_SKILLS_INDEPENDENCE: 'Life Skills & Independence',
  CHILD_DEVELOPMENT: 'Child Development',
  EDUCATION_LEARNING: 'Education & Learning',
  FAMILY_SUPPORT_COMMUNITY: 'Family Supports & Community',
  HEALTH_WELLBEING: 'Health & Wellbeing',
  SAFETY_PROTECTION: 'Safety & Protection',
};

export const ENUM_TO_AGE: Record<string, string> = {
  AGE_0_3: 'Infant (0–1)',
  AGE_4_6: 'Preschool (3–6)',
  AGE_7_10: 'Elementary (7–10)',
  AGE_10_13: 'Middle School (11–13)',
  AGE_14_18: 'High School (14–18)',
  AGE_18_ABOVE: 'University & Above (18+)',
};
