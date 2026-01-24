import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ResourceGridCard from '@/components/ResourceGridCardComponent/ResourceGridCard';
import { API_BASE_URL } from '@/config/api';
import './AdminCenter.css';

// Import icons (reusing from AdminContent/ResourceGridCard context if possible, 
// or importing directly. Since ResourceGridCard has the map, maybe we can export it? 
// For now I'll import them here too or just pass the category string to ResourceGridCard 
// which handles the icon internally, but we need an icon for the header)
import parentingImg from '@/assets/cms_parenting_skills_relationships.png'; // Using the CMS images for the header potentially, or existing icons
import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';

const CATEGORY_MAP: Record<string, string> = {
    'parenting-skills-relationships': 'PARENTING_SKILLS_RELATIONSHIPS',
    'child-development': 'CHILD_DEVELOPMENT',
    'mental-emotional-health': 'MENTAL_EMOTIONAL_HEALTH',
    'safety-protection': 'SAFETY_PROTECTION',
    'education-learning': 'EDUCATION_LEARNING',
    'health-wellbeing': 'HEALTH_WELLBEING',
    'life-skills-independence': 'LIFE_SKILLS_INDEPENDENCE',
    'family-support-community': 'FAMILY_SUPPORT_COMMUNITY',
};

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
    PARENTING_SKILLS_RELATIONSHIPS: 'Parenting Skills & Relationships',
    CHILD_DEVELOPMENT: 'Child Development',
    MENTAL_EMOTIONAL_HEALTH: 'Mental & Emotional Health',
    SAFETY_PROTECTION: 'Safety & Protection',
    EDUCATION_LEARNING: 'Education & Learning',
    HEALTH_WELLBEING: 'Health & Wellbeing',
    LIFE_SKILLS_INDEPENDENCE: 'Life Skills & Independence',
    FAMILY_SUPPORT_COMMUNITY: 'Family Support & Community',
};

const CATEGORY_ICON_MAP: Record<string, string> = {
    PARENTING_SKILLS_RELATIONSHIPS: parentingIcon,
    CHILD_DEVELOPMENT: childDevIcon,
    MENTAL_EMOTIONAL_HEALTH: mentalHealthIcon,
    SAFETY_PROTECTION: safetyIcon,
    EDUCATION_LEARNING: educationIcon,
    HEALTH_WELLBEING: wellbeingIcon,
    LIFE_SKILLS_INDEPENDENCE: lifeSkillsIcon,
    FAMILY_SUPPORT_COMMUNITY: familySupportIcon,
};

export default function AdminCategoryContent() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categoryEnum = category ? CATEGORY_MAP[category] : undefined;
    const displayTitle = categoryEnum ? CATEGORY_DISPLAY_MAP[categoryEnum] : 'Category Not Found';
    const categoryIcon = categoryEnum ? CATEGORY_ICON_MAP[categoryEnum] : undefined;

    useEffect(() => {
        if (!categoryEnum) return;

        async function fetchResources() {
            try {
                setLoading(true);
                const token = await getToken();
                // Even if public, we might want to send token if needed, but GET /resources is likely public or admin protected
                // The getAllResources controller checks for category query param
                const res = await fetch(`${API_BASE_URL}/api/resources?category=${categoryEnum}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setResources(data);
                } else {
                    console.error("Failed to fetch resources");
                }
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchResources();
    }, [categoryEnum, getToken]);

    if (!categoryEnum) {
        return <div>Invalid Category</div>;
    }

    return (
        <div className="admin-category-content">
            <div className="admin-header-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/admin/admin-center/content-management')} className="back-button" style={{
                    background: '#66D1C1',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    marginRight: '20px',
                    fontWeight: 'bold'
                }}>
                    Back
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#66D1C1', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Content Management - {displayTitle}
                    {categoryIcon && <img src={categoryIcon} alt="" style={{ height: '30px' }} />}
                </h2>
                <button style={{
                    background: '#66D1C1',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>
                    + New Content
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {resources.map((resource) => (
                        <ResourceGridCard
                            key={resource.id}
                            id={resource.id}
                            title={resource.title}
                            description={resource.description}
                            tags={resource.labels?.map((l: any) => l.label.label_name) || []} // Assuming labels structure
                            category={resource.category}
                            imageUrl={resource.imageUrl} // Controller returns imageUrl
                            isBookmarked={false} // Admin view doesn't need bookmark state usually, or we can fetch it
                            isAdmin={true}
                            onDelete={() => console.log('Delete', resource.id)}
                            onEdit={() => console.log('Edit', resource.id)}
                        />
                    ))}
                    {/* Add empty placeholders to match the design if needed, but grid usually handles it */}
                </div>
            )}
        </div>
    );
}
