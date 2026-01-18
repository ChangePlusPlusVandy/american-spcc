import './CreateCollection.css';
import { useEffect, useState } from 'react';

interface CreateCollectionProps {
  isOpen: boolean;
  existingNames: string[];
  imageUrl?: string;
  onCancel: () => void;
  onCreate: (name: string) => void;
}

function CreateCollection({
  isOpen,
  existingNames,
  imageUrl,
  onCancel,
  onCreate,
}: CreateCollectionProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  const normalizedExisting = existingNames.map((n) => n.trim().toLowerCase());

  const handleCreate = () => {
    const trimmed = name.trim();

    if (normalizedExisting.includes(trimmed.toLowerCase())) {
      setError('You already have this name.');
      return;
    }

    setError('');
    onCreate(trimmed);
  };

  if (!isOpen) return null;

  return (
    <div className="create-overlay" onClick={onCancel}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-content">
          <h2>New Collection</h2>

          <label>
            Title
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </label>

          {error && <div className="fieldError">{error}</div>}

          <div className="create-actions">
            <button className="cancel" onClick={onCancel}>
              Cancel
            </button>

            <button className="create" disabled={!name.trim()} onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCollection;
