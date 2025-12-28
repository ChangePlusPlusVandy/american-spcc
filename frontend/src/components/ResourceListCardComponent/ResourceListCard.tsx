import styles from './ResourceListCard.module.css';
import { type ResourceListCardProps } from './ResourceListCardDefinitions';
import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';
import bookmarkIcon from '@/assets/bookmark.png'

const CATEGORY_ICON_MAP: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: parentingIcon,
  CHILD_DEVELOPMENT: childDevIcon,
  MENTAL_EMOTIONAL_HEALTH: mentalHealthIcon,
  SAFETY_PROTECTION: safetyIcon,
  EDUCATION_LEARNING: educationIcon,
  HEALTH_WELLBEING: wellbeingIcon,
  LIFE_SKILLS_INDEPENDENCE: lifeSkillsIcon,
  FAMILY_SUPPORT_COMMUNITY: familySupportIcon,
};

function ResourceListCard({
  title,
  description,
  tags,
  category,
  imageUrl,
  onLearnMore,
}: ResourceListCardProps) {
  const categoryIcon = CATEGORY_ICON_MAP[category];

  return (
    <div className={styles.card}>
      {/* BOOKMARK — here */}
      <button className={styles.bookmark}>
        <img
          src={bookmarkIcon}
          alt="Save"
          className={styles.bookmarkIcon}
        />
      </button>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          {categoryIcon && (
            <img src={categoryIcon} alt={category} className={styles.categoryIcon} />
          )}
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className={styles.description}>{description}</p>

        <button className={styles.learnMoreButton} onClick={onLearnMore}>
          Learn More
        </button>
        </div>

        {imageUrl && (
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt={title} className={styles.image} />
          </div>
        )}
        </div>
  );
}

export default ResourceListCard;
