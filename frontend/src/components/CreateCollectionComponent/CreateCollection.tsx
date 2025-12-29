import './CreateCollection.css';
import { useState } from 'react';

interface CreateCollectionProps {
  isOpen: boolean;
  imageUrl?: string;
  onCancel: () => void;
  onCreate: (name: string) => void;
}

function CreateCollection({
  isOpen,
  imageUrl,
  onCancel,
  onCreate,
}: CreateCollectionProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="create-overlay" onClick={onCancel}>
      <div
        className="create-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <div className="create-image">
            <img src={imageUrl} alt="Preview" />
          </div>
        )}

        <div className="create-content">
          <h2>Create collection</h2>

          <label>
            Name
            <input
              placeholder='Like "Places to Go" or "Recipes to Make"'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="create-actions">
            <button className="cancel" onClick={onCancel}>
              Cancel
            </button>

            <button
              className="create"
              disabled={!name.trim()}
              onClick={() => onCreate(name)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCollection;
