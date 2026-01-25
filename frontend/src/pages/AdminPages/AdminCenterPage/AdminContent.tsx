import './AdminCenter.css';

import parentingImg from '@/assets/cms_parenting_skills_relationships.png';
import childDevImg from '@/assets/cms_child_development.png';
import mentalHealthImg from '@/assets/cms_mental_emotional_health.png';
import lifeSkillsImg from '@/assets/cms_life_skills_independence.png';
import educationImg from '@/assets/cms_education_learning.png';
import familySupportImg from '@/assets/cms_family_support_community.png';
import healthImg from '@/assets/cms_health_wellbeing.png';
import safetyImg from '@/assets/cms_safety_protection.png';

const categories = [
  { title: 'Parenting Skills & Relationships', img: parentingImg },
  { title: 'Child Development', img: childDevImg },
  { title: 'Mental & Emotional Health', img: mentalHealthImg },
  { title: 'Life Skills & Independence', img: lifeSkillsImg },
  { title: 'Education & Learning', img: educationImg },
  { title: 'Family Support & Community', img: familySupportImg },
  { title: 'Health & Wellbeing', img: healthImg },
  { title: 'Safety & Protection', img: safetyImg },
];

import { Link } from 'react-router-dom';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Parenting Skills & Relationships': 'parenting-skills-relationships',
  'Child Development': 'child-development',
  'Mental & Emotional Health': 'mental-emotional-health',
  'Life Skills & Independence': 'life-skills-independence',
  'Education & Learning': 'education-learning',
  'Family Support & Community': 'family-support-community',
  'Health & Wellbeing': 'health-wellbeing',
  'Safety & Protection': 'safety-protection',
};

export default function AdminContent() {
  return (
    <>
      <h3 className="admin-panel-title">Content Management</h3>

      <div className="cms-grid">
        {categories.map(({ title, img }) => (
          <Link key={title} to={`${CATEGORY_SLUG_MAP[title]}`} className="cms-card">
            <img src={img} alt={title} />
            <div className="cms-card-title">{title}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
