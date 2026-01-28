import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';
import './AdminCategoryContent.css';
import AdminResourceCard from '@/components/AdminResourceCardComponent/AdminResourceCard';
import TopicEditorForm from '@/components/AdminContentEditComponent/AdminContentEdit';

import { CATEGORY_DISPLAY_MAP, CATEGORY_ICON_MAP } from '@constants/categories';

const CATEGORY_MAP: Record<string, string> = {
  'parenting-skills-relationships': 'PARENTING_SKILLS_RELATIONSHIPS',
  'child-development': 'CHILD_DEVELOPMENT',
  'mental-emotional-health': 'MENTAL_EMOTIONAL_HEALTH',
  'safety-protection': 'SAFETY_PROTECTION',
  'education-learning': 'EDUCATION_LEARNING',
  'health-wellbeing': 'HEALTH_WELLBEING',
  'life-skills-independence': 'LIFE_SKILLS_INDEPENDENCE',
  'family-support-community': 'FAMILY_SUPPORT_COMMUNITY',
};

export default function AdminCategoryContent() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const categoryEnum = category ? CATEGORY_MAP[category] : undefined;
  const displayTitle = categoryEnum ? CATEGORY_DISPLAY_MAP[categoryEnum] : 'Category Not Found';
  const categoryIcon = categoryEnum ? CATEGORY_ICON_MAP[categoryEnum] : undefined;

  async function handleSave(payload: any) {}

  useEffect(() => {
    if (!categoryEnum) return;

    async function fetchResources() {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/resources?category=${categoryEnum}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        } else {
          console.error('Failed to fetch resources');
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [categoryEnum, getToken]);

  if (!categoryEnum) {
    return <div>Invalid Category</div>;
  }

  return (
    <>
      <div className="admin-category-content">
        <div className="admin-category-header-row">
          <button
            onClick={() => navigate('/admin/admin-center/content-management')}
            className="back-button"
          >
            Back
          </button>
        </div>
        <div className="admin-category-shell">
          <div className="admin-category-title-row">
            <h2 className="admin-category-title">
              <span className="admin-category-title-text">Content Management – {displayTitle}</span>

              {categoryIcon && (
                <img src={categoryIcon} alt="" className="admin-category-title-icon" />
              )}
            </h2>

            <button
              className="new-content-button"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              + New Content
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="admin-category-grid">
              {resources.map((resource) => (
                <AdminResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  imageUrl={resource.imageUrl}
                  category={resource.category}
                  resourceType={resource.resource_type}
                  tags={resource.labels?.map((l: any) => l.label.label_name) || []}
                  onEdit={() => {
                    setEditing(resource);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-5xl mx-4 bg-[#FFF9F0] rounded-lg shadow-lg border-4 border-[#55C3C0] pt-8 px-8 pb-8 overflow-auto max-h-[90vh]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-lg"
              style={{ background: 'transparent', border: 'none' }}
            >
              ×
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#55C3C0]">Content Editing</h2>
            </div>

            <TopicEditorForm
              topic={editing}
              category={categoryEnum}
              onSave={async (p) => {
                await handleSave(p);
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
