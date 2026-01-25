import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

export type ResourceType =
  | 'PDF'
  | 'TXT'
  | 'VIDEO'
  | 'WEBINAR'
  | 'WEBPAGE'
  | 'INTERACTIVE_QUIZ'
  | 'OTHER';
// export type HostingType = 'INTERNAL'|'EXTERNAL'|'OTHER';
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

type Topic = {
  id: string;
  title: string;
  description: string;
  resourceUrl?: string | null;
  image?: File | null;
  labels: string[] | CategoryLabel[];
  category: CategoryType;
  ageGroup: AgeGroup;
  timeToRead: number;
  language: Language;
  resourceType?: ResourceType | null;
};

type SavePayload = Topic | Omit<Topic, 'id'>;

export default function TopicEditorForm({
  topic,
  onSave,
  onDelete,
  onClose,
}: {
  topic?: Topic;
  onSave: (t: SavePayload) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const [suggestions, setSuggestions] = useState<CategoryLabel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<CategoryLabel[]>([]);
  const [newLabels, setNewLabels] = useState<string[]>([]); // local-only until saved
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    Array.isArray(topic?.labels) && topic?.labels.length
      ? (topic.labels as CategoryLabel[]).map((l) => l.id)
      : []
  );

  const [form, setForm] = useState({
    title: topic?.title ?? '',
    description: topic?.description ?? '',
    resourceUrl: topic?.resourceUrl ?? '',
    image: topic?.image ?? null,
    labels: topic?.labels ?? null,
    category: topic?.category ?? null,
    ageGroup: topic?.ageGroup ?? null,
    timeToRead: topic?.timeToRead ?? null,
    language: topic?.language ?? null,
    resourceType: topic?.resourceType ?? null,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const labelsForSave = {
        label_ids: selectedLabelIds, // existing label ids
        new_labels: newLabels, // free-text labels to create
      };

      const payload: SavePayload & { label_ids?: string[]; new_labels?: string[] } = topic
        ? { ...topic, ...form, ...labelsForSave }
        : ({ ...form, ...labelsForSave } as Omit<Topic, 'id'> & {
            label_ids?: string[];
            new_labels?: string[];
          });

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  }

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

  return (
  <form onSubmit={handleSave} className="relative">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <label className="block">
          <div className="text-sm font-medium">Title</div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Description</div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="mt-1 w-full border rounded px-3 py-2 h-40"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Resource URL</div>
          <input
            value={form.resourceUrl}
            onChange={(e) => setForm({ ...form, resourceUrl: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Image Upload</div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Labels</div>
          {/* keep existing labels UI unchanged */}
          {!form.category ? (
            <div className="text-sm text-gray-500">Select a category first to pick labels</div>
          ) : (
            /* ... existing label UI here ... (no change) ... */
            <div className="space-y-2">
              {/* existing code unchanged: selected labels, newLabels, input, suggestions */}
              {/* copy the existing label UI from the file into this spot */}
            </div>
          )}
        </label>
      </div>

      <div className="space-y-4">
        <label className="block">
          <div className="text-sm font-medium">Category</div>
          <select
            value={form.category ?? ''}
            onChange={(e) => setForm({ ...form, category: e.target.value as CategoryType })}
            required
            className="mt-1 w-full border rounded px-3 py-2"
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
          <div className="text-sm font-medium">Age Group</div>
          <select
            value={form.ageGroup ?? ''}
            onChange={(e) => setForm({ ...form, ageGroup: e.target.value as AgeGroup })}
            required
            className="mt-1 w-full border rounded px-3 py-2"
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
          <div className="text-sm font-medium">Time-To-Read</div>
          <input
            type="number"
            value={form.timeToRead ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                timeToRead: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="text-sm font-medium">Language</div>
          <select
            value={form.language ?? ''}
            onChange={(e) => setForm({ ...form, language: e.target.value as Language })}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="">Select language</option>
            <option value="ENGLISH">English</option>
            <option value="SPANISH">Spanish</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label className="block">
          <div className="text-sm font-medium">Resource Type</div>
          <select
            value={form.resourceType ?? ''}
            onChange={(e) => setForm({ ...form, resourceType: e.target.value as ResourceType })}
            className="mt-1 w-full border rounded px-3 py-2"
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
      {onDelete && topic?.id && (
        <button
          type="button"
          onClick={async () => {
            if (confirm('Delete topic?')) {
              await onDelete(topic.id);
              onClose();
            }
          }}
          className="text-red-600 mr-4"
        >
          Delete
        </button>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-teal-400 text-white rounded font-semibold"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  </form>
  );
}
