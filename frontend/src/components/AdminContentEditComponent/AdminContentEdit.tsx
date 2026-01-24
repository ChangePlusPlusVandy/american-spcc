import React, { useState, useRef, useEffect } from 'react';

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
      const payload: SavePayload = topic
        ? { ...topic, ...form }
        : ({ ...form } as Omit<Topic, 'id'>);
      onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
    setSaving(false);
  }

  useEffect(() => {
    if (!form.category) {
      setAvailableLabels([]);
      setSelectedLabelIds([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/labels?category=${encodeURIComponent(form.category)}`
        );
        if (!res.ok) throw new Error('Failed fetching labels');
        const labels: CategoryLabel[] = await res.json();
        setAvailableLabels(labels);
        // if editing, keep existing selected ids (merge)
      } catch (err) {
        console.error(err);
      }
    })();
  }, [form.category]);

  return (
    <form onSubmit={handleSave} className="space-y-4">
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
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>
      <label className="block">
        <div className="text-sm font-medium">Resource URL</div>
        <input
          value={form.resourceUrl}
          onChange={(e) => setForm({ ...form, resourceUrl: e.target.value })}
          required
        />
      </label>
      <label className="block">
        <div className="text-sm font-medium">Image Upload</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          required // TODO: need to add onChange behavior
        />
      </label>
      <label className="block">
        <div className="text-sm font-medium">Labels</div>

        {!form.category ? (
          <div className="text-sm text-gray-500">Select a category first to pick labels</div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {availableLabels.map((l) => (
                <label key={l.id} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLabelIds.includes(l.id)}
                    onChange={(e) => {
                      setSelectedLabelIds((prev) =>
                        e.target.checked ? [...prev, l.id] : prev.filter((id) => id !== l.id)
                      );
                    }}
                  />
                  <span className="text-sm">{l.label_name}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-600 mb-1">Add a custom label (max 50 chars)</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New label"
                  maxLength={50}
                  value={''}
                  onChange={() => {}} // see note below for controlled input option
                  onKeyDown={async (e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    const val = input.value.trim();
                    if (e.key === 'Enter' && val) {
                      e.preventDefault();
                      // avoid dupes in availableLabels/newLabels
                      if (
                        availableLabels.some(
                          (x) => x.label_name.toLowerCase() === val.toLowerCase()
                        ) ||
                        newLabels.some((x) => x.toLowerCase() === val.toLowerCase())
                      ) {
                        input.value = '';
                        return;
                      }
                      setNewLabels((prev) => [...prev, val]);
                      input.value = '';
                    }
                  }}
                  className="flex-1 border rounded px-2 py-1"
                />
                <div className="text-xs text-gray-600 self-center">Press Enter to add</div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {newLabels.map((nl, i) => (
                  <span
                    key={nl + i}
                    className="px-2 py-1 bg-gray-100 rounded text-sm inline-flex items-center gap-2"
                  >
                    {nl}
                    <button
                      type="button"
                      onClick={() => setNewLabels((prev) => prev.filter((x) => x !== nl))}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </label>
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
        <div className="text-sm font-medium">Category</div>
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
        <input type="number" required />
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
      <div className="flex justify-end gap-2">
        {onDelete && topic?.id && (
          <button
            type="button"
            onClick={async () => {
              if (confirm('Delete topic?')) {
                await onDelete(topic.id);
                onClose();
              }
            }}
            className="text-red-600"
          >
            Delete
          </button>
        )}
        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
