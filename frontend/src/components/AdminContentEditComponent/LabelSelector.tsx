import type { CategoryLabel, CategoryType } from './AdminContentEdit';
import styles from './AdminContentEdit.module.css';
import type { Dispatch, SetStateAction } from 'react';

export default function LabelSelector({
  category,
  labelInput,
  setLabelInput,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  availableLabels,
  setAvailableLabels,
  selectedLabelIds,
  setSelectedLabelIds,
  newLabels,
  setNewLabels,
}: {
  category?: CategoryType | null;
  labelInput: string;
  setLabelInput: (s: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (b: boolean) => void;
  suggestions: CategoryLabel[];
  availableLabels: CategoryLabel[];
  setAvailableLabels: Dispatch<SetStateAction<CategoryLabel[]>>;
  selectedLabelIds: string[];
  setSelectedLabelIds: Dispatch<SetStateAction<string[]>>;
  newLabels: string[];
  setNewLabels: Dispatch<SetStateAction<string[]>>;
}) {
  if (!category) {
    return <div className="text-sm text-gray-500">Select a category first to pick labels</div>;
  }

  const handleSelectedRemove = (id: string) => {
    setSelectedLabelIds((prev) => prev.filter((l) => l !== id));
  };

  return (
    <div className={styles.labelBox}>
      <div className={styles.labelBoxInner}>
        {selectedLabelIds.map((id) => {
          const lab =
            availableLabels.find((l) => l.id === id) || suggestions.find((l) => l.id === id);
          return (
            <span key={id} className={styles.adminLabels}>
              {lab?.label_name ?? id}
              <button
                type="button"
                onMouseDown={(ev) => {
                  ev.stopPropagation();
                  handleSelectedRemove(id);
                }}
                className={styles.adminLabelRemove}
                aria-label={`Remove ${lab?.label_name ?? id}`}
              >
                ×
              </button>
            </span>
          );
        })}

        {newLabels.map((nl) => (
          <span key={nl} className={styles.adminLabels}>
            {nl}
            <button
              type="button"
              onMouseDown={(ev) => {
                ev.stopPropagation();
                setNewLabels((prev) => prev.filter((n) => n !== nl));
              }}
              className={styles.adminLabelRemove}
              aria-label={`Remove ${nl}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={labelInput}
          onChange={(e) => {
            setLabelInput(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Type to add labels"
          maxLength={50}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const val = labelInput.trim();
              if (!val) return;
              setNewLabels((p) =>
                p.some((n) => n.toLowerCase() === val.toLowerCase()) ? p : [...p, val]
              );
              setLabelInput('');
              setShowSuggestions(false);
            } else if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          className={styles.adminLabelInput}
        />
      </div>
      <div className="relative">
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border mt-1 max-h-48 overflow-auto">
            {suggestions.slice(0, 10).map((s) => (
              <li
                key={s.id}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  if (!selectedLabelIds.includes(s.id)) {
                    setSelectedLabelIds((p) => [...p, s.id]);
                  }
                  setAvailableLabels((prev) =>
                    prev.some((x) => x.id === s.id) ? prev : [s, ...prev]
                  );
                  setLabelInput('');
                  setShowSuggestions(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {s.label_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
