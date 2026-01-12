import styles from './ResourceGridCard.module.css';
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
import bookmarkFilled from '@/assets/bookmark-filled.png';
import CreateCollection from '@/components/CreateCollectionComponent/CreateCollection';
import { API_BASE_URL } from '@/config/api';
import SaveResource from '@/components/SaveResourceComponent/SaveResource';
import { useAuth } from '@clerk/clerk-react';

interface ResourceGridCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  isBookmarked: boolean;
  onLearnMore?: () => void;
  onSaved?: (payload: {
    collectionName: string;
    imageUrl?: string;
    undo: () => void;
    resourceId: string;
  }) => void;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onCreateCollection?: (imageUrl?: string) => void;
}
const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  PARENTING_SKILLS_RELATIONSHIPS: 'Parenting Skills & Relationships',
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

function ResourceGridCard({
  id,
  title,
  tags,
  description,
  category,
  imageUrl,
  isBookmarked,
  onLearnMore,
  onSaved,  
  onBookmarkChange,
  onCreateCollection,
}: ResourceGridCardProps) {
  const categoryIcon = CATEGORY_ICON_MAP[category];
  const [flipped, setFlipped] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingResourceId, setPendingResourceId] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | undefined>();
  const [collections, setCollections] = useState<{ id: string; name: string }[]>(
    []
  );
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchCollections() {
      const token = await getToken();
      if (!token) return;
  
      const res = await fetch(`${API_BASE_URL}/api/collections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) return;
  
      const data = await res.json();
      setCollections(data);
    }
  
    if (showCreateModal) {
      fetchCollections();
    }
  }, [showCreateModal, getToken]);
  

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSavePopup]);
  
  return (
    <div
      className={styles.card}
      onMouseLeave={() => {
        setFlipped(false);
      }}
    >
      <div className={`${styles.inner} ${flipped ? styles.flipped : ''}`}>
        <div className={styles.front}>
          <div className={styles.bookmarkWrapper} ref={popupRef}>
            <button
              className={styles.bookmark}
              aria-label="Save to collection"
              onClick={(e) => {
                e.stopPropagation();
              setShowSavePopup((prev) => !prev);
              }}
            >
            <img
              src={isBookmarked ? bookmarkFilled : bookmarkIcon}
              alt=""
              className={styles.bookmarkIcon}
            />
            </button>
            <SaveResource
              isOpen={showSavePopup}
              onClose={() => setShowSavePopup(false)}
              resourceId={id}
              resourceImage={imageUrl}
              onSaved={(payload) => {
                onSaved?.({
                  ...payload,
                  resourceId: id,
                });
              }}
              onBookmarkChange={(isBookmarked) => {
                setShowSavePopup(false);
                onBookmarkChange?.(isBookmarked);
              }}
              onCreateCollection={(imageUrl, resourceId) => {
                setPendingResourceId(resourceId ?? null);
                setPendingImageUrl(imageUrl);
                setShowCreateModal(true);
              }}
            />
            <CreateCollection
              isOpen={showCreateModal}
              existingNames={collections.map(c => c.name)}
              imageUrl={pendingImageUrl}
              onCancel={() => setShowCreateModal(false)}
              onCreate={async (name) => {

                const token = await getToken();
                if (!token) return;
                
                // 1. create collection
                const res = await fetch(`${API_BASE_URL}/api/collections`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name }),
                });
                
                if (!res.ok) {
                  console.error('Create collection failed', res.status);
                  return;
                }
                
                const collection = await res.json();
                
                // 2. add resource to collection
                let createdItemId: string | null = null;
                
                if (pendingResourceId) {
                  const itemRes = await fetch(
                    `${API_BASE_URL}/api/collections/${collection.id}/items`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ resource_fk: pendingResourceId }),
                    }
                  );
                
                  const item = await itemRes.json();
                  createdItemId = item.id;
                }
                

                onSaved?.({
                  collectionName: collection.name,
                  imageUrl: pendingImageUrl,
                  resourceId: pendingResourceId!,
                  undo: async () => {
                    if (!createdItemId) return;
                  
                    const token = await getToken();
                    if (!token) return;
                  
                    await fetch(
                      `${API_BASE_URL}/api/collections/items/${createdItemId}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  },
                  
                });

                onBookmarkChange?.(true);

                setShowCreateModal(false);
                setShowSavePopup(false);
              }}
            />




          </div>
          <div className={styles.titleRow}>
            {categoryIcon && (
              <div className={styles.categoryIcon}>
                <img src={categoryIcon} alt={category} />
              </div>
            )}
            <h3 className={styles.title}>{title}</h3>
          </div>
          <div
            className={styles.imageContainer}
            onMouseEnter={() => setFlipped(true)}
          >
            <img src={imageUrl} alt={title} className={styles.image} />
          </div>
          <div className={styles.tagsContainer}>
          <span className={styles.tagPrefix}>
            {CATEGORY_DISPLAY_MAP[category]}
          </span>

          {tags.length > 0 && (
            <>
              <span style={{ flexBasis: '100%', height: 0 }} />

              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>          
        </div>
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
  );
}

export default ResourceGridCard;
