import { useEffect, useRef, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import './Account.css';
import CreateCollection from '@components/CreateCollectionComponent/CreateCollection';
import { useClerk } from '@clerk/clerk-react';
import CheckboxDropdown from '@/components/CheckboxDropdownComponent/CheckboxDropdown';
import SingleSelectDropdown from '@/components/SingleSelectDropdownComponent/SingleSelectDropdown';
import { API_BASE_URL } from '@/config/api';

interface DbUser {
  first_name: string | null;
  last_name: string | null;
  email: string;
  relationship: string | null;
  household_type: string | null;
  kids_age_groups: string[];
  topics_of_interest: string[];
}

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

interface EditFormState {
  first_name: string;
  last_name: string;
  relationship: string;
  household_type: string;
  kids_age_groups: string[];
  topics_of_interest: string[];
}

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openUserProfile } = useClerk();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'uploading' | 'error'>('idle');

  const [editForm, setEditForm] = useState<EditFormState>({
    first_name: '',
    last_name: '',
    relationship: '',
    household_type: '',
    kids_age_groups: [],
    topics_of_interest: [],
  });

  const fetchDbUser = async () => {
    if (!user) return;

    const token = await getToken();
    if (!token) {
      console.error('No auth token, aborting fetchDbUser');
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/users/clerk/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data: DbUser = await res.json();
    setDbUser(data);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const token = await getToken();
    if (!token) {
      console.error('No auth token, aborting save');
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        relationship: editForm.relationship || null,
        household_type: editForm.household_type || null,
        kids_age_groups: editForm.kids_age_groups,
        topics_of_interest: editForm.topics_of_interest,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Profile update failed:', res.status, text);
      return;
    }

    await fetchDbUser();
    setIsEditOpen(false);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${API_BASE_URL}/api/collections`, {
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

  useEffect(() => {
    if (isLoaded && user) {
      fetchDbUser();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (!dbUser) return;

    setEditForm({
      first_name: dbUser.first_name ?? '',
      last_name: dbUser.last_name ?? '',
      relationship: dbUser.relationship ?? '',
      household_type: dbUser.household_type ?? '',
      kids_age_groups: dbUser.kids_age_groups ?? [],
      topics_of_interest: dbUser.topics_of_interest ?? [],
    });
  }, [dbUser, isEditOpen]);

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    if (!dbUser) return;

    if (user.primaryEmailAddress.emailAddress === dbUser.email) return;

    (async () => {
      const token = await getToken();

      await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress!.emailAddress,
        }),
      });

      await fetchDbUser();
    })();
  }, [user?.primaryEmailAddress?.emailAddress]);

  if (!isLoaded || !user || !dbUser) return null;

  return (
    <div className="h-screen px-4 py-6 account-page">
      <div className="max-w-7xl mx-auto">
        <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          {/* LEFT: PROFILE */}
          <div className="account-card p-6 h-full lg:w-[40%] shrink-0">
            <div className="flex justify-between items-start">
              <h2
                className="text-[#6EC6BF] text-[1.4rem]"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 900,
                }}
              >
                Your Profile
              </h2>

              <button className="edit-profile-btn" onClick={() => setIsEditOpen(true)}>
                <span>Edit</span>
                <span className="edit-icon">✎</span>
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <label className="avatar-wrapper">
                <img src={user.imageUrl} alt="Profile" className="avatar-image" />

                <div className="avatar-overlay">
                  <span className="avatar-icon">✎</span>
                  <span className="avatar-text">Change photo</span>
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user) return;

                    if (!file.type.startsWith('image/')) {
                      setAvatarStatus('error');
                      e.target.value = '';
                      return;
                    }

                    try {
                      setAvatarStatus('uploading');

                      const fixedFile = new File([file], file.name, {
                        type: file.type || 'image/jpeg',
                      });

                      await user.setProfileImage({ file: fixedFile });
                      setAvatarStatus('idle');
                    } catch (err) {
                      console.error('Avatar upload failed', err);
                      setAvatarStatus('error');
                    } finally {
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              <p className="profile-name">
                {dbUser.first_name} {dbUser.last_name}
              </p>

              <p
                className={`avatar-status ${
                  avatarStatus === 'uploading' ? 'show' : ''
                } ${avatarStatus === 'error' ? 'show error' : ''}`}
              >
                {avatarStatus === 'uploading' && 'Uploading profile picture…'}
                {avatarStatus === 'error' &&
                  'Profile picture upload failed. Please use JPG or PNG.'}
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <p className="profile-field">
                Email: <span className="profile-value">{dbUser.email}</span>
              </p>

              <p className="profile-field">
                Relationship:{' '}
                <span className="profile-value">
                  {dbUser.relationship
                    ? dbUser.relationship
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : '—'}
                </span>
              </p>

              <p className="profile-field">
                Household Type:{' '}
                <span className="profile-value">
                  {dbUser.household_type
                    ? dbUser.household_type
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : '—'}
                </span>
              </p>

              <p className="profile-field">
                Age Group:{' '}
                <span className="profile-value">
                  {dbUser.kids_age_groups.length
                    ? dbUser.kids_age_groups
                        .map((age) => age.replace('AGE_', '').replace('_', '–'))
                        .join(', ')
                    : '—'}
                </span>
              </p>

              <p className="profile-field">Topics of Interest:</p>

              <div className="profile-tags">
                {dbUser.topics_of_interest.map((topic) => (
                  <span key={topic} className="profile-tag">
                    {topic
                      .replace(/_/g, ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: COLLECTIONS */}
          <div className="account-card p-6 flex flex-col min-h-0 lg:w-[60%] grow">
            <div className="flex justify-between items-start">
              <h2
                className="text-[#6EC6BF] text-[1.4rem]"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 900,
                }}
              >
                Your Collections
              </h2>

              <button className="new-collection-btn" onClick={() => setIsCreateOpen(true)}>
                + New Collection
              </button>
            </div>

            {loadingCollections && <p className="text-sm text-gray-500">Loading collections…</p>}

            {!loadingCollections && collections.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-6">
                You haven’t created any collections yet.
              </p>
            )}

            {!loadingCollections && collections.length > 0 && (
              <div className="mt-4 space-y-3 overflow-y-auto collections-scroll flex-1 min-h-0">
                {collections.map((collection) => {
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
                          <div className="collection-menu" onClick={(e) => e.stopPropagation()}>
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
                                {collection.items.map((item) => (
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
          existingNames={collections.map((c) => c.name)}
          onCancel={() => setIsCreateOpen(false)}
          onCreate={async (name) => {
            try {
              const token = await getToken();

              const res = await fetch(`${API_BASE_URL}/api/collections`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
              });

              if (!res.ok) throw new Error('Failed to create collection');

              const newCollection: Collection = await res.json();

              setCollections((prev) => [{ ...newCollection, items: [] }, ...prev]);

              setExpandedId(newCollection.id);
              setIsCreateOpen(false);
            } catch (err) {
              console.error('Create collection failed', err);
            }
          }}
        />

        {deleteTarget && (
          <div className="create-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="create-modal" onClick={(e) => e.stopPropagation()}>
              <div className="create-content">
                <h2>Delete collection</h2>

                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot
                  be undone.
                </p>

                <div className="create-actions">
                  <button className="cancel" onClick={() => setDeleteTarget(null)}>
                    Cancel
                  </button>

                  <button
                    className="create"
                    style={{ backgroundColor: '#d14343' }}
                    onClick={async () => {
                      try {
                        const token = await getToken();

                        await fetch(`${API_BASE_URL}/api/collections/${deleteTarget.id}`, {
                          method: 'DELETE',
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        setCollections((prev) => prev.filter((c) => c.id !== deleteTarget.id));

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

        {isEditOpen && (
          <div className="edit-overlay" onClick={() => setIsEditOpen(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Profile</h2>

              <div className="edit-form">
                <div className="edit-row">
                  <label>
                    First Name
                    <input
                      type="text"
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Last Name
                    <input
                      type="text"
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Email
                  <input type="email" value={dbUser.email} disabled className="readonly-input" />
                  <button
                    type="button"
                    className="manage-auth-link"
                    onClick={() =>
                      openUserProfile({
                        appearance: {
                          variables: {
                            colorPrimary: '#6EC6BF',
                            fontFamily: 'Poppins, sans-serif',
                            borderRadius: '12px',
                          },
                          elements: {
                            navbar: 'hidden',
                            footer: 'hidden',
                          },
                        },
                      })
                    }
                  >
                    Manage email & password
                  </button>
                </label>

                <label className="edit-label">
                  Relationship Type
                  <SingleSelectDropdown
                    label="Select relationship type..."
                    value={editForm.relationship}
                    onChange={(v) =>
                      setEditForm({
                        ...editForm,
                        relationship: v,
                      })
                    }
                    options={[
                      { label: 'Mother', value: 'MOTHER' },
                      { label: 'Father', value: 'FATHER' },
                      { label: 'Guardian', value: 'GUARDIAN' },
                      { label: 'Grandparent', value: 'GRANDPARENT' },
                      { label: 'Other', value: 'OTHER' },
                      {
                        label: 'Prefer not to say',
                        value: 'PREFER_NOT_TO_SAY',
                      },
                    ]}
                  />
                </label>

                <label className="edit-label">
                  Household Type
                  <SingleSelectDropdown
                    label="Select household type..."
                    value={editForm.household_type}
                    onChange={(v) =>
                      setEditForm({
                        ...editForm,
                        household_type: v,
                      })
                    }
                    options={[
                      { label: 'Married', value: 'MARRIED' },
                      {
                        label: 'Single Parent',
                        value: 'SINGLE_PARENT',
                      },
                      {
                        label: 'Divorced / Separated',
                        value: 'DIVORCED_SEPARATED',
                      },
                      { label: 'Widowed', value: 'WIDOWED' },
                      { label: 'Other', value: 'OTHER' },
                      {
                        label: 'Prefer not to say',
                        value: 'PREFER_NOT_TO_SAY',
                      },
                    ]}
                  />
                </label>

                <div className="edit-label">
                  <span className="edit-label-text">Age Groups</span>

                  <CheckboxDropdown
                    label="Select age group..."
                    value={editForm.kids_age_groups}
                    onChange={(v) =>
                      setEditForm({
                        ...editForm,
                        kids_age_groups: v,
                      })
                    }
                    options={[
                      { label: 'Infant (0–3)', value: 'AGE_0_3' },
                      { label: 'Preschool (4–6)', value: 'AGE_4_6' },
                      { label: 'Elementary (7–10)', value: 'AGE_7_10' },
                      { label: 'Middle School (11–13)', value: 'AGE_10_13' },
                      { label: 'High School (14–18)', value: 'AGE_14_18' },
                      { label: 'University & Above (18+)', value: 'AGE_18_ABOVE' },
                    ]}
                  />
                </div>

                <div className="edit-label">
                  <span className="edit-label-text">Topics of Interest</span>

                  <CheckboxDropdown
                    label="Select topics of interest..."
                    value={editForm.topics_of_interest}
                    onChange={(vals) =>
                      setEditForm({
                        ...editForm,
                        topics_of_interest: vals,
                      })
                    }
                    options={[
                      {
                        label: 'Parenting Skills & Relationships',
                        value: 'PARENTING_SKILLS_RELATIONSHIPS',
                      },
                      { label: 'Child Development', value: 'CHILD_DEVELOPMENT' },
                      { label: 'Mental & Emotional Health', value: 'MENTAL_EMOTIONAL_HEALTH' },
                      { label: 'Safety & Protection', value: 'SAFETY_PROTECTION' },
                      { label: 'Education & Learning', value: 'EDUCATION_LEARNING' },
                      { label: 'Health & Wellbeing', value: 'HEALTH_WELLBEING' },
                      { label: 'Life Skills & Independence', value: 'LIFE_SKILLS_INDEPENDENCE' },
                      { label: 'Family Support & Community', value: 'FAMILY_SUPPORT_COMMUNITY' },
                    ]}
                  />
                </div>

                <div className="edit-actions">
                  <button onClick={() => setIsEditOpen(false)}>Cancel</button>

                  <button onClick={handleSaveProfile}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
