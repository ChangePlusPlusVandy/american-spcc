import React from 'react';
import { useNavigate } from 'react-router-dom';
import parentingIcon from '@/assets/parenting_skills_relationships_icon.png';
import childDevIcon from '@/assets/child_development_icon.png';
import mentalHealthIcon from '@/assets/mental_emotional_health_icon.png';
import safetyIcon from '@/assets/safety_protection_icon.png';
import educationIcon from '@/assets/education_learning.png';
import wellbeingIcon from '@/assets/health_wellbeing_icon.png';
import lifeSkillsIcon from '@/assets/life_skills_independence_icon.png';
import familySupportIcon from '@/assets/family_support_community_icon.png';
import { X, Heart } from 'lucide-react';
import Button from '../ButtonComponent/Button';
import { ButtonColor, ButtonVariant } from '../ButtonComponent/ButtonDefinitions';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: mentalHealthIcon,
      label: 'Mental & Emotional Health',
      category: 'MENTAL_EMOTIONAL_HEALTH',
    },
    {
      icon: parentingIcon,
      label: 'Parenting Skills & Relationships',
      category: 'PARENTING_SKILLS_RELATIONSHIPS',
    },
    {
      icon: lifeSkillsIcon,
      label: 'Life Skills & Independence',
      category: 'LIFE_SKILLS_INDEPENDENCE',
    },
    {
      icon: educationIcon,
      label: 'Education & Learning',
      category: 'EDUCATION_LEARNING',
    },
    {
      icon: familySupportIcon,
      label: 'Family Support & Community',
      category: 'FAMILY_SUPPORT_COMMUNITY',
    },
    {
      icon: childDevIcon,
      label: 'Child Development',
      category: 'CHILD_DEVELOPMENT',
    },
    {
      icon: wellbeingIcon,
      label: 'Health & Wellbeing',
      category: 'HEALTH_WELLBEING',
    },
    {
      icon: safetyIcon,
      label: 'Safety & Protection',
      category: 'SAFETY_PROTECTION',
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[90]
          bg-black/20 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-[100]
          w-[350px] h-screen
          bg-[#FFF9F0]
          shadow-2xl
          flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-start">
        <h2
          className="text-[#6EC6BF] text-[1.4rem]"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 900,
          }}
        >
          Parenting Topics
        </h2>



          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isTeal = index % 2 === 0;

            return (
            <button
              key={item.category}
              onClick={() => {
                navigate(`/filter?category=${item.category}`);
                onClose();
              }}
              className={`
                w-full flex items-center gap-4 px-6 py-4 text-left
                ${isTeal ? '!bg-[#55C3C0]' : '!bg-[#FFF9F0]'}
                ${isTeal ? 'text-white' : 'text-[#566273]'}
                font-normal text-sm tracking-normal
                transition-colors hover:opacity-90
                focus-visible:outline-none
                !rounded-none
              `}
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 700, // change to 300, 500, 600, etc.
              }}
              
              
              
              
              
              
            >

                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-5 h-5 object-contain ${isTeal ? 'brightness-0 invert' : ''}`}
                />

                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#FFF9F0] flex justify-end items-center">


        <div className="w-auto">
          <Button
            variant={ButtonVariant.Small}
            color={ButtonColor.Teal}
            onClick={() =>
              window.open(
                'https://americanspcc.org/championforchildrenaward/?form=FUNHJFZUBKZ',
                '_blank'
              )
            }
          >
            <span className="flex items-center gap-2">
              Donate
              <Heart size={16} className="fill-red-400 text-red-400" />
            </span>
          </Button>
        </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
