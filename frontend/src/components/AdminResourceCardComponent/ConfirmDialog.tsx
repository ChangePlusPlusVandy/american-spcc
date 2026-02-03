import React from 'react';
import styles from './AdminResourceCard.module.css';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  style?: React.CSSProperties;
};

export default function ConfirmDialog({ open, title, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-dialog-window" role="dialog" aria-modal="true">
      <div style={{ marginBottom: 8, fontWeight: 600 }}>
        Are you sure you want to delete '{title}'?
      </div>
      <div style={{ marginBottom: 12 }}>This action cannot be undone.</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="admin-cancel-button" aria-label="Cancel">
          No
        </button>
        <button onClick={onConfirm} className="admin-confirm-button" aria-label="Confirm">
          Yes
        </button>
      </div>
    </div>
  );
}
