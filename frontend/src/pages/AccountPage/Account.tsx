import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import './Account.css';

interface Collection {
  id: string;
  title: string;
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

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
        setCollections(data);
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

        {/* ================= LEFT: PROFILE ================= */}
        <div className="account-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="account-card-title">Your Profile</h2>
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => {
                // later: navigate('/account/edit') or open modal
              }}
            >
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

          {/* App-specific fields (DB-driven later) */}
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

        {/* ================= RIGHT: COLLECTIONS ================= */}
        <div className="lg:col-span-2 account-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="account-card-title">Your Collections</h2>
            <button
              className="px-3 py-1 text-sm bg-[#4AA6A6] text-white rounded-md hover:opacity-90"
            >
              + New Collection
            </button>
          </div>

          {/* Loading */}
          {loadingCollections && (
            <p className="text-sm text-gray-500">Loading collections…</p>
          )}

          {/* Empty state */}
          {!loadingCollections && collections.length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-6">
              You haven’t created any collections yet.
            </p>
          )}

          {/* Collections list */}
          {!loadingCollections && collections.length > 0 && (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 collections-scroll">
              {collections.map(collection => (
                <div
                  key={collection.id}
                  className="collection-item px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-black">
                      {collection.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
