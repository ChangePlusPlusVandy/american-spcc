import React, { useState } from "react";
import "./FilterComponent.css";

interface FilterComponentProps {
  selectedTopics?: string[];
  selectedAges?: string[];
  onTopicChange?: (topics: string[]) => void;
  onAgeChange?: (ages: string[]) => void;
}

export default function FilterComponent({
  selectedTopics = [],
  selectedAges = [],
  onTopicChange,
  onAgeChange,
}: FilterComponentProps) {
  const topicInitial = [
    "Parenting Skills & Relationships",
    "Mental & Emotional Health",
    "Life Skills & Independence",
  ];

  const topicFull = [
    "Parenting Skills & Relationships",
    "Mental & Emotional Health",
    "Life Skills & Independence",
    "Child Development",
    "Education & Learning",
    "Family Supports & Community",
    "Health & Wellbeing",
    "Safety & Protection",
  ];

  const ageInitial = ["Infant (0–1)", "Preschool (3–6)", "Elementary (7–10)"];

  const ageFull = [
    "Infant (0–1)",
    "Preschool (3–6)",
    "Elementary (7–10)",
    "Middle School (11–13)",
    "High School (14–18)",
    "University & Above (18+)",
  ];

  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showAllAges, setShowAllAges] = useState(false);

  const handleTopicClick = (topic: string) => {
    if (!onTopicChange) return;

    if (selectedTopics.includes(topic)) {
      onTopicChange(selectedTopics.filter(t => t !== topic));
    } else {
      onTopicChange([...selectedTopics, topic]);
    }
  };

  const handleAgeClick = (age: string) => {
    if (!onAgeChange) return;

    if (selectedAges.includes(age)) {
      onAgeChange(selectedAges.filter(a => a !== age));
    } else {
      onAgeChange([...selectedAges, age]);
    }
  };

  return (
    <div className="filter-box">
      <h3 className="filter-title">Filter</h3>

      {/* TOPICS */}
      <p className="filter-section-title">What Topic?</p>
      <div className="chip-wrapper">
        {(showAllTopics ? topicFull : topicInitial).map((t) => (
          <button
            key={t}
            className={`chip ${selectedTopics.includes(t) ? 'chip-selected' : ''}`}
            onClick={() => handleTopicClick(t)}
          >
            {t}
          </button>
        ))}

        {!showAllTopics && (
          <button
            className="chip chip-more"
            onClick={() => setShowAllTopics(true)}
          >
            More
          </button>
        )}
      </div>

      {/* AGE */}
      <p className="filter-section-title">Child's Age</p>
      <div className="chip-wrapper">
        {(showAllAges ? ageFull : ageInitial).map((a) => (
          <button
            key={a}
            className={`chip ${selectedAges.includes(a) ? 'chip-selected' : ''}`}
            onClick={() => handleAgeClick(a)}
          >
            {a}
          </button>
        ))}

        {!showAllAges && (
          <button
            className="chip chip-more"
            onClick={() => setShowAllAges(true)}
          >
            More
          </button>
        )}
      </div>
    </div>
  );
}
