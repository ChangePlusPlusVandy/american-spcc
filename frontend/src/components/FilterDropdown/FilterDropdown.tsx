import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';
import dropdownArrow from '../../assets/dropdown_arrow.png';

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;

  selected: string | string[] | null;
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  style?: React.CSSProperties;
}
function FilterDropdown({
  label,
  icon,
  options,
  selected,
  onChange,
  multiSelect = false,
  style,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      const currentSelected = Array.isArray(selected) ? selected : [];
      if (currentSelected.includes(value)) {
        onChange(currentSelected.filter((v) => v !== value));
      } else {
        onChange([...currentSelected, value]);
      }
    } else {
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

  const displayLabel = label;

  return (
    <div className="dropdown" ref={dropdownRef} style={style}>
      <button
        className="dropdownButton"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{
          paddingTop: '10px',
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {icon && <span className="icon">{icon}</span>}
        <span style={{ fontWeight: '700' }}>{displayLabel}</span>
        <img
          src={dropdownArrow}
          alt="dropdown arrow"
          className="chevron"
          style={{
            transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)',
            width: '16px',
            height: '16px',
          }}
        />
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
                  <span className={`selectionIndicator ${itemSelected ? 'visible' : 'hidden'}`}>
                    ●
                  </span>
                )}
                {option.icon && <span className="optionIcon">{option.icon}</span>}
                <span className="optionLabel">{option.label}</span>
                {multiSelect && <span className="checkbox">{itemSelected ? '☑' : '☐'}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
