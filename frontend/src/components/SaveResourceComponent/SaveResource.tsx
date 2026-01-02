import './SaveResource.css';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import bookmarkOutline from '@/assets/small-bookmark.png';
import bookmarkFilled from '@/assets/small-bookmark-filled.png';


interface SaveResourceProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceImage?: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onSaved?: (payload: {
    collectionName: string;
    imageUrl?: string;
    undo: () => void;
  }) => void;

  onCreateCollection?: (imageUrl?: string, resourceId?: string) => void;

}

interface CollectionItem {
    id: string;
    resource_fk: string;
  }
  
  interface Collection {
    id: string;
    name: string;
    items: CollectionItem[];
  }
  

function SaveResource({
  isOpen,
  onClose,
  resourceId,
  resourceImage,
  onBookmarkChange,
  onSaved,
  onCreateCollection,
}: SaveResourceProps) {
  const { isSignedIn } = useAuth();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);


  
  
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 160);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visible]);

  useEffect(() => {
    if (!isOpen || !isSignedIn) return;

    async function fetchCollections() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/collections', {
          credentials: 'include',
        });
        const data = await res.json();
        setCollections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [isOpen, isSignedIn]);

  if (!visible) return null;

  if (!isSignedIn) {
    return (
      <div className={`save-popover ${closing ? 'closing' : ''}`}>
        <div className="save-unauth">
          <a href="/sign-in">Sign in</a> to save resources!
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`save-popover ${closing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="save-body">
        {loading && (
            <div className="collection-item" style={{ cursor: 'default' }}>
                Loading collections…
            </div>
            )}

            {!loading && collections.length === 0 && (
            <div className="collection-item" style={{ cursor: 'default' }}>
                No collections yet
            </div>
            )}


            {collections.map((collection) => {
                const isSaved = collection.items.some(
                    (item) => item.resource_fk === resourceId
                );

                return (
                <button
                key={collection.id}
                className="collection-item"
                onClick={async (e) => {
                    e.stopPropagation();

                    if (isSaved) {
                    const item = collection.items.find(
                        (i) => i.resource_fk === resourceId
                    );
                    if (!item) return;

                    await fetch(
                        `http://localhost:8000/api/collections/items/${item.id}`,
                        { method: 'DELETE', credentials: 'include' }
                    );
                    } else {
                    const res = await fetch(
                        `http://localhost:8000/api/collections/${collection.id}/items`,
                        {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ resource_fk: resourceId }),
                        }
                    );

                    const createdItem = await res.json();

                    onSaved?.({
                        collectionName: collection.name,
                        imageUrl: resourceImage,
                        undo: async () => {
                        await fetch(
                            `http://localhost:8000/api/collections/items/${createdItem.id}`,
                            {
                            method: 'DELETE',
                            credentials: 'include',
                            }
                        );
                        },
                    });
                    }

                    const res2 = await fetch('http://localhost:8000/api/collections', {
                    credentials: 'include',
                    });
                    const updatedCollections = await res2.json();
                    setCollections(updatedCollections);

                    const stillBookmarked = updatedCollections.some(
                    (c: Collection) =>
                        c.items.some((i) => i.resource_fk === resourceId)
                    );

                    onBookmarkChange?.(stillBookmarked);

                    onClose();
                }}
                >
                <span className="collection-name">{collection.name}</span>

                <img
                    src={isSaved ? bookmarkFilled : bookmarkOutline}
                    alt=""
                    className="bookmark-icon"
                />
                </button>

                );
                })}
        </div>
        <div className="save-footer">
          <button
            className="save-create"
            onClick={() => onCreateCollection?.(resourceImage, resourceId)}
          >
            + Create collection
          </button>
        </div>
      </div>
    </>
  );
}

export default SaveResource;
