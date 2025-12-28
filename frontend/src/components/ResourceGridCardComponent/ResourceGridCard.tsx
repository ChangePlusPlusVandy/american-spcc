import styles from './ResourceGridCard.module.css';
import { type ResourceGridCardProps } from './ResourceGridCardDefinitions';
import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';
import bookmarkIcon from '@/assets/bookmark.png'; // 👈 ADD THIS
import { useState } from 'react';

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

function ResourceGridCard({
  title,
  tags,
  description,
  category,
  imageUrl = 'https://placehold.co/600x400',
  onLearnMore,
}: ResourceGridCardProps) {
  const categoryIcon = CATEGORY_ICON_MAP[category];
  const [flipped, setFlipped] = useState(false);


  return (
<div
  className={styles.card}
  onMouseLeave={() => setFlipped(false)} // 👈 unflip ONLY here
>
  <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
    {/* FRONT */}
    <div className={styles.front}>
      {/* 🔖 BOOKMARK */}
      <button
        className={styles.bookmark}
        aria-label="Save to collection"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={bookmarkIcon} alt="" className={styles.bookmarkIcon} />
      </button>

      <div className={styles.titleRow}>
        {categoryIcon && (
          <div className={styles.categoryIcon}>
            <img src={categoryIcon} alt={category} />
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
      </div>

      {/* 👇 FLIP TRIGGER */}
      <div
        className={styles.imageContainer}
        onMouseEnter={() => setFlipped(true)} // 👈 flip ON
      >
        <img src={imageUrl} alt={title} className={styles.image} />
      </div>

      <div className={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>

    {/* BACK */}
    <div className={styles.back}>
      <p className={styles.description}>
        {description || 'No description available.'}
      </p>

      {onLearnMore && (
        <button
          className={styles.learnMoreButton}
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore();
          }}
        >
          Learn More
        </button>
      )}
    </div>
  </div>
</div>
  )}

export default ResourceGridCard;
