import React from 'react';
import {
  X,
  Brain,
  HeartHandshake,
  User,
  BookOpen,
  Users,
  Sprout,
  Activity,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Brain,
      label: 'Mental & Emotional Health',
      category: 'MENTAL_EMOTIONAL_HEALTH',
    },
    {
      icon: HeartHandshake,
      label: 'Parenting Skills & Relationships',
      category: 'PARENTING_SKILLS_RELATIONSHIPS',
    },
    {
      icon: User,
      label: 'Life Skills & Independence',
      category: 'LIFE_SKILLS_INDEPENDENCE',
    },
    {
      icon: BookOpen,
      label: 'Education & Learning',
      category: 'EDUCATION_LEARNING',
    },
    {
      icon: Users,
      label: 'Family Support & Community',
      category: 'FAMILY_SUPPORT_COMMUNITY',
    },
    {
      icon: Sprout,
      label: 'Child Development',
      category: 'CHILD_DEVELOPMENT',
    },
    {
      icon: Activity,
      label: 'Health & Wellbeing',
      category: 'HEALTH_WELLBEING',
    },
    {
      icon: ShieldCheck,
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
          <h2 className="text-[#55C3C0] text-2xl font-bold font-['Suez_One']">
            Parenting Topics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
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
                  font-bold text-sm font-['Open_Sans']
                  transition-colors hover:opacity-90
                  focus-visible:outline-none
                  !rounded-none
                `}
              >
                <item.icon
                  size={24}
                  className={`${isTeal ? 'text-white' : 'text-[#566273]'} stroke-[1.5]`}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#FFF9F0] flex justify-between items-center border-t border-gray-100">
          <button
            onClick={() => {
              navigate('/sign-in');
              onClose();
            }}
            className="!bg-[#55C3C0] !text-white px-6 py-2 rounded-full font-bold hover:!bg-[#4ab0ad] transition-colors shadow-md"
          >
            Sign In
          </button>

          <button
            className="!bg-[#55C3C0] !text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:!bg-[#4ab0ad] transition-colors shadow-md"
          >
            Donate
            <Heart size={16} className="fill-red-400 text-red-400" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
