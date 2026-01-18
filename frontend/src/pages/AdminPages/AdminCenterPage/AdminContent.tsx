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

export default function AdminContent() {
  return (
    <>
      <h3 className="admin-panel-title">Content Management</h3>

      <div className="cms-grid">
        {categories.map(({ title, img }) => (
          <div key={title} className="cms-card">
            <img src={img} alt={title} />
            <div className="cms-card-title">{title}</div>
          </div>
        ))}
      </div>
    </>
  );
}
