import React from "react";
import { useState } from "react";
import { FilterState } from "./FilterComponent";
import "./FilterComponent.css";

interface FilterProps {
  onChange?: (filters: FilterState) => void;
}

export default function FilterComponent({ onChange }: FilterProps) {
  const [category, setCategory] = useState("");
  const [completedOnly, setCompletedOnly] = useState(false);

  function updateFilters(next: FilterState) {
    if (onChange) onChange(next);
  }

  return (
    <div className="filter-container">
      <div className="filter-section">
        <label className="filter-label">Category</label>
        <select
          className="filter-dropdown"
          value={category}
          onChange={(e) => {
            const val = e.target.value;
            setCategory(val);
            updateFilters({ category: val, completedOnly });
          }}
        >
          <option value="">All</option>
          <option value="math">Math</option>
          <option value="reading">Reading</option>
          <option value="science">Science</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Completed Only</label>
        <input
          type="checkbox"
          checked={completedOnly}
          onChange={(e) => {
            const val = e.target.checked;
            setCompletedOnly(val);
            updateFilters({ category, completedOnly: val });
          }}
        />
      </div>
    </div>
  );
}
