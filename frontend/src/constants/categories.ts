import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';

export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: 'Parenting Skills & Relationships',
  CHILD_DEVELOPMENT: 'Child Development',
  MENTAL_EMOTIONAL_HEALTH: 'Mental & Emotional Health',
  SAFETY_PROTECTION: 'Safety & Protection',
  EDUCATION_LEARNING: 'Education & Learning',
  HEALTH_WELLBEING: 'Health & Wellbeing',
  LIFE_SKILLS_INDEPENDENCE: 'Life Skills & Independence',
  FAMILY_SUPPORT_COMMUNITY: 'Family Support & Community',
};

export const CATEGORY_ICON_MAP: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: parentingIcon,
  CHILD_DEVELOPMENT: childDevIcon,
  MENTAL_EMOTIONAL_HEALTH: mentalHealthIcon,
  SAFETY_PROTECTION: safetyIcon,
  EDUCATION_LEARNING: educationIcon,
  HEALTH_WELLBEING: wellbeingIcon,
  LIFE_SKILLS_INDEPENDENCE: lifeSkillsIcon,
  FAMILY_SUPPORT_COMMUNITY: familySupportIcon,
};
