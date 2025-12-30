import styles from './ResourceListCard.module.css';
import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';
import bookmarkIcon from '@/assets/bookmark.png';

import { useState, useRef, useEffect } from 'react';
import SaveResource from '@/components/SaveResourceComponent/SaveResource';
interface ResourceListCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  onLearnMore?: () => void;
  onSaved?: (payload: {
    collectionName: string;
    imageUrl?: string;
    undo: () => void;
  }) => void;

  onCreateCollection?: (imageUrl?: string, resourceId?: string) => void;

}

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: 'Parenting & Relationships',
  CHILD_DEVELOPMENT: 'Child Development',
  MENTAL_EMOTIONAL_HEALTH: 'Mental & Emotional Health',
  SAFETY_PROTECTION: 'Safety & Protection',
  EDUCATION_LEARNING: 'Education & Learning',
  HEALTH_WELLBEING: 'Health & Wellbeing',
  LIFE_SKILLS_INDEPENDENCE: 'Life Skills & Independence',
  FAMILY_SUPPORT_COMMUNITY: 'Family Support & Community',
};

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
  id,
  title,
  description,
  tags,
  category,
  imageUrl,
  onLearnMore,
  onSaved,
  onCreateCollection,
}: ResourceListCardProps) {


  const categoryIcon = CATEGORY_ICON_MAP[category];

  const [showSavePopup, setShowSavePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        showSavePopup &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setShowSavePopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSavePopup]);

  return (
    <div className={styles.card}>
      <div className={styles.bookmarkWrapper} ref={popupRef}>
        <button
          className={styles.bookmark}
          aria-label="Save to collection"
          onClick={(e) => {
            e.stopPropagation();
            setShowSavePopup((prev) => !prev);
          }}
        >
          <img src={bookmarkIcon} alt="" className={styles.bookmarkIcon} />
        </button>
        <SaveResource
          isOpen={showSavePopup}
          onClose={() => setShowSavePopup(false)}
          resourceId={id}
          resourceImage={imageUrl}
          onSaved={onSaved}
          onCreateCollection={onCreateCollection}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          {categoryIcon && (
            <img src={categoryIcon} alt={category} className={styles.categoryIcon} />
          )}
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.tagsContainer}>
          <span className={styles.tagPrefix}>Topic:</span>
          <span className={styles.tag}>
            {CATEGORY_DISPLAY_MAP[category]}
          </span>

          {tags.length > 0 && (
            <>
              <span className={styles.tagPrefix}>Descriptors:</span>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>



        <p className={styles.description}>{description}</p>

        {onLearnMore && (
          <button className={styles.learnMoreButton} onClick={onLearnMore}>
            Learn More
          </button>
        )}
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
