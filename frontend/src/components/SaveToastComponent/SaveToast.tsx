import './SaveToast.css';

interface SaveToastProps {
  open: boolean;
  collectionName: string;
  imageUrl?: string;
  onUndo?: () => void;
}

export default function SaveToast({ open, collectionName, imageUrl, onUndo }: SaveToastProps) {
  if (!open) return null;

  return (
    <div className="save-toast">
      {imageUrl && <img src={imageUrl} alt="" className="save-toast-image" />}

      <div className="save-toast-text">
        Saved to <strong>{collectionName}</strong>
      </div>

      {onUndo && (
        <button className="save-toast-undo" onClick={onUndo}>
          Undo
        </button>
      )}
    </div>
  );
}
