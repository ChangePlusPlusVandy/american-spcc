import styles from './ResourceListCard.module.css';
import { type ResourceListCardProps } from './ResourceListCardDefinitions';

function ResourceListCard({
  title,
  description,
  tags,
  imageUrl = 'https://placehold.co/600x400',
  onLearnMore,
}: ResourceListCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

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

      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
      </div>
    </div>
  );
}

export default ResourceListCard;
