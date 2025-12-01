import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;  // Optional icon for each option
  }>;
  // Support both single and multi-select
  selected: string | string[] | null;
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;  // Enable multi-select mode
}

function FilterDropdown({
  label,
  icon,
  options,
  selected,
  onChange,
  multiSelect = false
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (value: string) => {
    if (multiSelect) {
      // Multi-select: toggle value in array
      const currentSelected = Array.isArray(selected) ? selected : [];
      if (currentSelected.includes(value)) {
        onChange(currentSelected.filter(v => v !== value));
      } else {
        onChange([...currentSelected, value]);
      }
      // Don't close dropdown for multi-select
    } else {
      // Single-select: replace value
      onChange(value);
      setIsOpen(false);
    }
  };

  const isSelected = (value: string): boolean => {
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  // Always display the original label, not the selected option
  const displayLabel = label;

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="dropdownButton"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {icon && <span className="icon">{icon}</span>}
        <span>{displayLabel}</span>
        <span className="chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="dropdownMenu">
          {options.map((option) => {
            const itemSelected = isSelected(option.value);

            return (
              <button
                key={option.value}
                className={`dropdownItem ${itemSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                type="button"
              >
                {!multiSelect && (
                  <span className={`selectionIndicator ${itemSelected ? 'visible' : 'hidden'}`}>●</span>
                )}
                {option.icon && <span className="optionIcon">{option.icon}</span>}
                <span className="optionLabel">{option.label}</span>
                {multiSelect && (
                  <span className="checkbox">
                    {itemSelected ? '☑' : '☐'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
