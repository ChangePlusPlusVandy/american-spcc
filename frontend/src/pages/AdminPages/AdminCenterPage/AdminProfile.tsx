import './AdminCenter.css';
import { useState, useRef } from 'react';
import cloudUpload from '@assets/cloud_upload.png';
import { useClerk } from '@clerk/clerk-react';
import { useOutletContext } from 'react-router-dom';
import { API_BASE_URL } from '@/config/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
};

type OutletCtx = {
  dbUser: User | null;
  loading: boolean;
  fetchAdmin: () => Promise<void>;
};

interface EditFormState {
  first_name: string;
  last_name: string;
  avatarFile?: File | null;
}

export default function AdminProfile() {
  const { dbUser, loading, fetchAdmin } = useOutletContext<OutletCtx>();

  const { openUserProfile } = useClerk();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const [editForm, setEditForm] = useState<EditFormState>({
    first_name: '',
    last_name: '',
    avatarFile: null,
  });

  if (loading || !dbUser) return <div>Loading…</div>;

  const isValid =
    editForm.first_name.trim() !== '' || editForm.last_name.trim() !== '' || !!editForm.avatarFile;

  const hasChanges =
    editForm.first_name !== (dbUser.first_name ?? '') ||
    editForm.last_name !== (dbUser.last_name ?? '') ||
    !!editForm.avatarFile;

  const validate = () => {
    if (!hasChanges) {
      console.error('No changes made.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarStatus('error');
      e.currentTarget.value = '';
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setEditForm((prev) => ({ ...prev, avatarFile: file }));
    setAvatarStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (!user) return;

    setUpdating(true);
    try {
      const token = await getToken();
      if (!token) {
        console.error('No auth token, aborting save');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: editForm.first_name.trim() || undefined,
          last_name: editForm.last_name.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Profile update failed:', res.status, text);
        return;
      }

      if (editForm.avatarFile) {
        try {
          await user.setProfileImage({ file: editForm.avatarFile });
        } catch (err) {
          console.error('setProfileImage failed', err);
        }
      }

      await fetchAdmin();

      console.log('Profile saved successfully.');
      setEditForm({ first_name: '', last_name: '' });
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error(err?.message ?? 'Save failed');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (dbUser) {
      setEditForm({
        first_name: dbUser.first_name ?? '',
        last_name: dbUser.last_name ?? '',
        avatarFile: null,
      });
    }
  }, [dbUser]);

  return (
    <section className="admin-profile w-full px-8">
      <h3 className="admin-panel-title">Admin Profile</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#000000]">First Name</label>
            <input
              className="w-full py-3 px-2 rounded bg-[#57c5c1]"
              type="text"
              value={editForm.first_name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  first_name: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#000000]">Last Name</label>
            <input
              className="w-full py-3 px-2 rounded bg-[#57c5c1]"
              type="text"
              value={editForm.last_name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  last_name: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold">Email</label>
          <input
            type="email"
            value={dbUser.email}
            disabled
            className="w-full py-3 px-2 cursor-not-allowed readonly-input rounded bg-[#57c5c1]"
          />
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
        </div>

        <div className="h-full space-y-2">
          <label className="block text-sm font-bold text-[#000000]">Profile Photo</label>
          <div className="w-full h-full p-2 rounded bg-[#57c5c1] flex items-center justify-center">
            <div
              className="w-32 h-32 rounded overflow-hidden flex items-center justify-center cursor-pointer bg-[#57c5c1]"
              role="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload profile photo"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <img
                  src={cloudUpload}
                  alt="Profile preview"
                  className="object-cover w-full h-full"
                />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <p
              className={`avatar-status ${
                avatarStatus === 'uploading' ? 'show' : ''
              } ${avatarStatus === 'error' ? 'show error' : ''}`}
            >
              {avatarStatus === 'error' && 'Profile picture upload failed'}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!hasChanges}
            className="px-4 py-2 !bg-[#57c5c1] text-white text-bold rounded disabled:opacity-50"
          >
            {' '}
            UPDATE
          </button>
        </div>
      </form>
    </section>
  );
}
