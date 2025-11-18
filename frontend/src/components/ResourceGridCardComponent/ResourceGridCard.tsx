import styles from './ResourceGridCard.module.css';
import { type ResourceGridCardProps } from './ResourceGridCardDefinitions';

function ResourceGridCard({
  title,
  tags,
  imageUrl = 'https://placehold.co/600x400',
  onLearnMore,
}: ResourceGridCardProps) {
  return (
    <div className={styles.card} onClick={onLearnMore}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.imageContainer}>
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
  );
}

export default ResourceGridCard;
