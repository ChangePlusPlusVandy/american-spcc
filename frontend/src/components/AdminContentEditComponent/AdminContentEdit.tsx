import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import LabelSelector from './LabelSelector';
import styles from './AdminContentEdit.module.css';
import cloudUpload from '@assets/cloud_upload.png';

export type ResourceType =
  | 'PDF'
  | 'TXT'
  | 'VIDEO'
  | 'WEBINAR'
  | 'WEBPAGE'
  | 'INTERACTIVE_QUIZ'
  | 'OTHER';

export type HostingType = 'INTERNAL' | 'EXTERNAL' | 'OTHER';

export type CategoryType =
  | 'PARENTING_SKILLS_RELATIONSHIPS'
  | 'CHILD_DEVELOPMENT'
  | 'MENTAL_EMOTIONAL_HEALTH'
  | 'SAFETY_PROTECTION'
  | 'EDUCATION_LEARNING'
  | 'HEALTH_WELLBEING'
  | 'LIFE_SKILLS_INDEPENDENCE'
  | 'FAMILY_SUPPORT_COMMUNITY';

  export type AgeGroup =
  | 'AGE_0_3'
  | 'AGE_4_6'
  | 'AGE_7_10'
  | 'AGE_11_13'
  | 'AGE_14_18'
  | 'AGE_18_ABOVE';

  export type Language = 'ENGLISH' | 'SPANISH' | 'OTHER';

export type CategoryLabel = {
  id: string;
  label_name: string;
  category: CategoryType;
};

export type ResourceLabel = {
  id: string;
  resource_id: string;
  label_id: string;
  label: CategoryLabel;
};

type ExternalResources = {
  external_url: string;
};

export type Resource = {
  id: string;
  title: string;
  description?: string | null;
  resource_type: ResourceType;
  hosting_type: HostingType;
  category: CategoryType;
  age_groups: AgeGroup;
  language: Language;
  time_to_read: number;
  labels: ResourceLabel[];
  image_s3_key?: string | null;
  externalResources?: ExternalResources | null;
};

export type ResourceForm = {
  title: string | null;
  description?: string | null;
  resource_url?: string | null;
  image?: File | null;
  selectedLabelIds: string[] | null;
  newLabelNames: string[] | null;
  category: CategoryType | null;
  age_groups: AgeGroup | null;
  time_to_read: number | null;
  language: Language | null;
  resource_type: ResourceType | null;
  hosting_type: HostingType | null;
};

export default function ResourceEditorForm({
  resource,
  onSave,
  onDelete,
  onClose,
}: {
  resource?: Resource;
  category?: string;
  onSave: (t: ResourceForm) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const [suggestions, setSuggestions] = useState<CategoryLabel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<CategoryLabel[]>([]);
  const [newLabelNames, setNewLabelNames] = useState<string[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    () => resource?.labels?.map((l) => l.label_id) ?? []
  );
  const [form, setForm] = useState<ResourceForm>({
    title: resource?.title ?? null,
    description: resource?.description ?? null,
    resource_url: resource?.externalResources?.external_url ?? null,
    image: null,
    selectedLabelIds: null,
    newLabelNames: null,
    category: resource?.category ?? null,
    age_groups: resource?.age_groups ?? null,
    time_to_read: resource?.time_to_read ?? null,
    language: resource?.language ?? null,
    resource_type: resource?.resource_type ?? null,
    hosting_type: resource?.hosting_type ?? null,
  });
  const [saving, setSaving] = useState(false);

  const getBasename = (key?: string | null) => {
  if (!key) return null;
  const parts = key.split('/');
  return parts[parts.length - 1] || key;
};
const imageKeyName = getBasename(resource?.image_s3_key ?? null);
const imageDisplayName = form.image instanceof File ? form.image.name : imageKeyName;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let hosting_type = form.hosting_type;
      if (!hosting_type) {
        if (form.resource_url || form.image) {
          if (!form.resource_url) {
            hosting_type = 'INTERNAL';
          } else if (!form.image) {
            hosting_type = 'EXTERNAL';
          } else {
            hosting_type='OTHER';
          }
        } else {
          hosting_type='OTHER';
        }
      }

      setForm({...form, 
        hosting_type: hosting_type, 
        selectedLabelIds: selectedLabelIds,
        newLabelNames: newLabelNames
      });
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!resource?.labels) return;
    setSelectedLabelIds(resource.labels.map((l) => l.label_id));
  }, [form?.selectedLabelIds]);

  useEffect(() => {
    if (!form.category) {
      setSuggestions([]);
      return;
    }

    if (!labelInput.trim()) {
      setSuggestions(availableLabels.slice(0, 3));
      return;
    }

    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/labels/search?q=${encodeURIComponent(labelInput)}`
        );
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data: CategoryLabel[] = await res.json();
        const filtered = data.filter((l) => l.category === form.category);
        setSuggestions(filtered.slice(0, 10));
      } catch (err) {
        console.error('label search failed', err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [labelInput, form.category, availableLabels]);

  useEffect(() => {
    console.log('selectedLabelIds ->', selectedLabelIds);
    console.log('newLabelIds ->', newLabelNames);
  }, [selectedLabelIds, newLabelNames]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/labels?category=${encodeURIComponent(form.category)}`
        );
        if (!res.ok) {
          if (!cancelled) return;
        }
        const data: CategoryLabel[] = await res.json();
        if (cancelled) return;

        setAvailableLabels((prev) => {
          const map = new Map<string, CategoryLabel>();
          data.forEach((d) => map.set(d.id, d));
          prev.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          return Array.from(map.values());
        });

        if (!labelInput.trim()) {
          setSuggestions(data.slice(0, 3));
        }
      } catch (err) {
        console.error('failed loading labels for category', err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [form.category, resource]);

  return (
    <form onSubmit={handleSave} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <div className={styles.adminFormName}>Title</div>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={styles.adminFormInput}
            />
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Description</div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={styles.adminFormInput}
              style={{ height: '10rem' }}
            />
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Resource URL</div>
            <input
              value={form.resource_url}
              onChange={(e) => setForm({ ...form, resource_url: e.target.value })}
              className={styles.adminFormInput}
            />
          </label>

          <label className={styles.formRow}>
            <div className={styles.adminFormName}>Image Upload</div>
            <div className={styles.imageUploadBox}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            ></div>

            {form.image && typeof form.image !== 'string' ? (
      <div className={styles.imageUploadText}>
        {(form.image as File).name}
      </div>
    ) : (
      <div className={styles.imageUploadText}>.jpeg, .jpg, .png</div>
    )}
            <img src={cloudUpload} alt="upload" className={styles.imageUploadIcon} />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setForm({ ...form, image: f });
              }}
            />
            </div>
          </label>

          <label className={styles.formRow}>
            <div className={styles.adminFormName}>Labels</div>
            <LabelSelector
              category={form.category}
              labelInput={labelInput}
              setLabelInput={setLabelInput}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              availableLabels={availableLabels}
              setAvailableLabels={setAvailableLabels}
              selectedLabelIds={selectedLabelIds}
              setSelectedLabelIds={setSelectedLabelIds}
              newLabelNames={newLabelNames}
              setNewLabelNames={setNewLabelNames}
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <div className={styles.adminFormName}>Category</div>
            <select
              value={form.category ?? ''}
              onChange={(e) => setForm({ ...form, category: e.target.value as CategoryType })}
              required
              className={styles.adminFormInput}
            >
              <option value="">Select category</option>
              <option value="PARENTING_SKILLS_RELATIONSHIPS">Parenting & Relationships</option>
              <option value="CHILD_DEVELOPMENT">Child Development</option>
              <option value="MENTAL_EMOTIONAL_HEALTH">Mental & Emotional Health</option>
              <option value="SAFETY_PROTECTION">Safety & Protection</option>
              <option value="EDUCATION_LEARNING">Education & Learning</option>
              <option value="HEALTH_WELLBEING">Health & Wellbeing</option>
              <option value="LIFE_SKILLS_INDEPENDENCE">Life Skills & Independence</option>
              <option value="FAMILY_SUPPORT_COMMUNITY">Family Support & Community</option>
            </select>
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Age Group</div>
            <select
              value={form.age_groups ?? ''}
              onChange={(e) => setForm({ ...form, age_groups: e.target.value as AgeGroup })}
              required
              className={styles.adminFormInput}
            >
              <option value="">Select age group</option>
              <option value="AGE_0_3">0 - 3</option>
              <option value="AGE_4_6">4 - 6</option>
              <option value="AGE_7_10">7 - 10</option>
              <option value="AGE_11_13">11 - 13</option>
              <option value="AGE_14_18">14 - 18</option>
              <option value="AGE_18_ABOVE">18+</option>
            </select>
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Time-To-Read</div>
            <input
              type="number"
              value={form.time_to_read ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  time_to_read: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className={styles.adminFormInput}
            />
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Language</div>
            <select
              value={form.language ?? ''}
              onChange={(e) => setForm({ ...form, language: e.target.value as Language })}
              required
              className={styles.adminFormInput}
            >
              <option value="">Select language</option>
              <option value="ENGLISH">English</option>
              <option value="SPANISH">Spanish</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label className="block">
            <div className={styles.adminFormName}>Resource Type</div>
            <select
              value={form.resource_type ?? ''}
              onChange={(e) => setForm({ ...form, resource_type: e.target.value as ResourceType })}
              className={styles.adminFormInput}
              required
            >
              <option value="">Select resource type</option>
              <option value="PDF">PDF</option>
              <option value="TXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="WEBINAR">Webinar</option>
              <option value="WEBPAGE">Webpage</option>
              <option value="INTERACTIVE_QUIZ">Interactive Quiz</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button type="submit" disabled={saving} className={styles.adminSaveButton}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
