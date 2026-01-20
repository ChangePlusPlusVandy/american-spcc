import { useState } from 'react';
import './FilterComponent.css';
import { AGE_TO_ENUM } from '@/utils/filterMappings';

const TOPICS = [
  { label: 'Parenting Skills & Relationships', value: 'PARENTING_SKILLS_RELATIONSHIPS' },
  { label: 'Mental & Emotional Health', value: 'MENTAL_EMOTIONAL_HEALTH' },
  { label: 'Life Skills & Independence', value: 'LIFE_SKILLS_INDEPENDENCE' },
  { label: 'Child Development', value: 'CHILD_DEVELOPMENT' },
  { label: 'Education & Learning', value: 'EDUCATION_LEARNING' },
  { label: 'Family Supports & Community', value: 'FAMILY_SUPPORT_COMMUNITY' },
  { label: 'Health & Wellbeing', value: 'HEALTH_WELLBEING' },
  { label: 'Safety & Protection', value: 'SAFETY_PROTECTION' },
];

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
  const topicInitial = TOPICS.slice(0, 3);
  const topicFull = TOPICS;

  const ageInitial = [
    'Infant & Toddler (0–3)',
    'Preschool (4–6)',
    'Elementary (7–10)',
  ];
  
  const ageFull = [
    'Infant & Toddler (0–3)',
    'Preschool (4–6)',
    'Elementary (7–10)',
    'Middle School (11–13)',
    'High School (14–18)',
    'University & Above (18+)',
  ];
  

  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showAllAges, setShowAllAges] = useState(false);

  const handleTopicClick = (value: string) => {
    if (!onTopicChange) return;

    if (selectedTopics.includes(value)) {
      onTopicChange(selectedTopics.filter((t) => t !== value));
    } else {
      onTopicChange([...selectedTopics, value]);
    }
  };

  const handleAgeClick = (age: string) => {
    console.log('Clicked age label:', age);
    console.log('Mapped enum:', AGE_TO_ENUM?.[age]);  
    if (!onAgeChange) return;

    if (selectedAges.includes(age)) {
      onAgeChange(selectedAges.filter((a) => a !== age));
    } else {
      onAgeChange([...selectedAges, age]);
    }
  };

  return (
    <div className="filter-box">
      <h3 className="filter-title">Filter</h3>

      <p className="filter-section-title">What Topic?</p>
      <div className="chip-wrapper">
        {(showAllTopics ? topicFull : topicInitial).map(({ label, value }) => (
          <button
            key={value}
            className={`chip ${selectedTopics.includes(value) ? 'chip-selected' : ''}`}
            onClick={() => handleTopicClick(value)}
          >
            {label}
          </button>
        ))}

        {!showAllTopics && (
          <button className="chip chip-more" onClick={() => setShowAllTopics(true)}>
            More
          </button>
        )}
      </div>

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
          <button className="chip chip-more" onClick={() => setShowAllAges(true)}>
            More
          </button>
        )}
      </div>
    </div>
  );
}
