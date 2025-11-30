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
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    { icon: Brain, label: 'Mental & Emotional Health', color: 'bg-[#55C3C0]' },
    { icon: HeartHandshake, label: 'Parenting Skills & Relationships', color: 'bg-[#FFF9F0]' },
    { icon: User, label: 'Life Skills & Independence', color: 'bg-[#55C3C0]' },
    { icon: BookOpen, label: 'Education & Learning', color: 'bg-[#FFF9F0]' },
    { icon: Users, label: 'Family Support & Community', color: 'bg-[#55C3C0]' },
    { icon: Sprout, label: 'Child Development', color: 'bg-[#FFF9F0]' },
    { icon: Activity, label: 'Health & Wellbeing', color: 'bg-[#55C3C0]' },
    { icon: ShieldCheck, label: 'Safety & Protection', color: 'bg-[#FFF9F0]' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-start">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className="relative w-[350px] h-[85vh] mt-[10vh] ml-4 bg-[#FFF9F0] shadow-2xl flex flex-col rounded-lg animate-in slide-in-from-left duration-300">
        
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
      key={index}
      className={`
        w-full flex items-center gap-4 px-6 py-4 text-left
        ${isTeal ? "!bg-[#55C3C0]" : "!bg-[#FFF9F0]"}
        ${isTeal ? "text-white" : "text-[#566273]"}
        font-bold text-sm font-['Open_Sans']
        transition-colors hover:opacity-90
        focus-visible:outline-none
        !rounded-none
      `}
    >

      <item.icon
        size={24}
        className={`${isTeal ? "text-white" : "text-[#566273]"} stroke-[1.5]`}
      />
      {item.label}
    </button>
  );
})}

        </div>

        {/* Footer */}
        <div className="p-6 bg-[#FFF9F0] flex justify-between items-center border-t border-gray-100">
        
        {/* Sign In Button (same style as Donate, but no icon) */}
        <button
          onClick={() => navigate('/sign-in')}
          className="!bg-[#55C3C0] !text-white px-6 py-2 rounded-full font-bold hover:!bg-[#4ab0ad] transition-colors shadow-md"
        >
          Sign In
        </button>

        {/* Donate Button */}  
        <button
          className="!bg-[#55C3C0] !text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:!bg-[#4ab0ad] transition-colors shadow-md"
        >
          Donate
          <Heart size={16} className="fill-red-400 text-red-400" />
        </button>

      </div>

      </div>
    </div>
  );
};

export default Sidebar;
