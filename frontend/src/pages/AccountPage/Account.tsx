import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import './Account.css';
import CreateCollection from '@components/CreateCollectionComponent/CreateCollection';

interface CollectionResource {
  id: string;
  title: string;
  externalResources?: {
    external_url: string;
  };
}

interface CollectionItem {
  id: string;
  resource: CollectionResource;
}

interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);


  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);



  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = await getToken();

        const res = await fetch('http://localhost:8000/api/collections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await res.json();

        const normalized = data.map((c: Collection) => ({
          ...c,
          items: c.items ?? [],
        }));

        setCollections(normalized);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCollections(false);
      }
    };

    if (isLoaded && user) {
      fetchCollections();
    }
  }, [isLoaded, user, getToken]);

  if (!isLoaded || !user) return null;

  return (
    <div className="min-h-screen px-8 py-10 account-page">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="account-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="account-card-title">Your Profile</h2>
            <button className="text-sm text-gray-500 hover:underline">
              Edit
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full border mb-3"
            />

            <p className="font-medium text-gray-800">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-sm text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Household Type:</span> Other
            </p>
            <p>
              <span className="font-medium">Age Group:</span> Infant (0–3)
            </p>

            <p className="font-medium mt-3">Topics of Interest(s):</p>

            <div className="flex flex-wrap gap-2 mt-1">
              <span className="profile-tag">Safety & Protection</span>
              <span className="profile-tag">Life Skills & Independence</span>
              <span className="profile-tag">Health & Wellbeing</span>
              <span className="profile-tag">Child Development</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 account-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="account-card-title">Your Collections</h2>
            <button
              className="new-collection-btn"
              onClick={() => setIsCreateOpen(true)}
            >
              + New Collection
            </button>


          </div>

          {loadingCollections && (
            <p className="text-sm text-gray-500">Loading collections…</p>
          )}

          {!loadingCollections && collections.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-6">
              You haven’t created any collections yet.
            </p>
          )}

          {!loadingCollections && collections.length > 0 && (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 collections-scroll">
            {collections.map(collection => {
              const isOpen = expandedId === collection.id;

              return (
                <div key={collection.id} className="collection-wrapper">
                  <div className={`collection-shell ${isOpen ? 'open' : ''}`}>
                  <button
                    className={`collection-header ${isOpen ? 'expanded' : ''}`}
                    onClick={() => setExpandedId(isOpen ? null : collection.id)}
                  >
                    <span>{collection.name}</span>

                    <div className="collection-actions">
                      <span className="chevron">{isOpen ? '▲' : '▼'}</span>

                      <button
                        className="collection-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === collection.id ? null : collection.id);
                        }}
                      >
                        ⋮
                      </button>
                    </div>
                  </button>
                  {openMenuId === collection.id && (
                    <div
                      className="collection-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="collection-menu-item delete"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteTarget(collection);
                        }}
                      >
                        Delete collection
                      </button>

                    </div>
                  )}



                    <div className="collection-body">
                      <div className="collection-inner">
                        {collection.items.length === 0 ? (
                          <p className="empty-text">No resources yet</p>
                        ) : (
                          <ul className="resource-list">
                            {collection.items.map(item => (
                              <li key={item.resource.id}>
                                <a
                                  href={item.resource.externalResources?.external_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="resource-link-plain"
                                >
                                  {item.resource.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            </div>
          )}
        </div>
      </div>
      <CreateCollection
        isOpen={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onCreate={async (name) => {
          try {
            const token = await getToken();

            const res = await fetch('http://localhost:8000/api/collections', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error('Failed to create collection');

            const newCollection: Collection = await res.json();

            setCollections(prev => [
              {
                ...newCollection,
                items: [],
              },
              ...prev,
            ]);
            
            setExpandedId(newCollection.id);

            setIsCreateOpen(false);
          } catch (err) {
            console.error('Create collection failed', err);
          }
        }}
      />
        {deleteTarget && (
          <div className="create-overlay" onClick={() => setDeleteTarget(null)}>
            <div
              className="create-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="create-content">
                <h2>Delete collection</h2>

                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to delete{' '}
                  <strong>{deleteTarget.name}</strong>? This cannot be undone.
                </p>

                <div className="create-actions">
                  <button
                    className="cancel"
                    onClick={() => setDeleteTarget(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="create"
                    style={{ backgroundColor: '#d14343' }}
                    onClick={async () => {
                      try {
                        const token = await getToken();

                        await fetch(
                          `http://localhost:8000/api/collections/${deleteTarget.id}`,
                          {
                            method: 'DELETE',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        setCollections(prev =>
                          prev.filter(c => c.id !== deleteTarget.id)
                        );

                        setExpandedId(null);
                        setDeleteTarget(null);
                      } catch (err) {
                        console.error('Delete failed', err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
