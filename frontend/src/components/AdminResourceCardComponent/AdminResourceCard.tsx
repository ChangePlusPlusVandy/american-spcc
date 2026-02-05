import styles from './AdminResourceCard.module.css';
import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

import pdfIcon from '@/assets/pdf.png';
import txtIcon from '@/assets/txt.png';
import videoIcon from '@/assets/video.png';
import webinarIcon from '@/assets/webinar.png';
import webpageIcon from '@/assets/webpage.png';
import quizIcon from '@/assets/interactive_quiz.png';

const FORMAT_ICON_MAP: Record<string, string> = {
  PDF: pdfIcon,
  TXT: txtIcon,
  VIDEO: videoIcon,
  WEBINAR: webinarIcon,
  WEBPAGE: webpageIcon,
  INTERACTIVE_QUIZ: quizIcon,
};

export type AdminResourceCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  resourceType: string;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
};

export default function AdminResourceCard({
  id,
  title,
  imageUrl,
  tags,
  category,
  resourceType,
  onEdit,
  onDelete,
}: AdminResourceCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete?.(id);
    setConfirmOpen(false);
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        {FORMAT_ICON_MAP[resourceType] && (
          <img
            src={FORMAT_ICON_MAP[resourceType]}
            alt={resourceType}
            className={styles.formatIcon}
          />
        )}
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.imageContainer}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.delete} onClick={() => setConfirmOpen(true)}>
          delete
        </button>
        <span>|</span>
        <button className={styles.edit} onClick={onEdit}>
          edit
        </button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title={title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
