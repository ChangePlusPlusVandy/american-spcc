import { useState } from 'react';

import navSidebar from '../../assets/nav_sidebar_button.png';
import donateButton from '../../assets/donate_button.png';
import aspccLogoTurqoise from '../../assets/aspcc_logo_turqois.png';
import chevron from '../../assets/chevron.png';
import { useNavigate } from 'react-router-dom';

import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function DefaultNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  return (
    <nav
      className={'relative z-50 w-full bg-[#FFF9F0] px-4 py-4 flex items-center justify-between'}
    >
      <div className="flex items-center gap-x-10">
        {/* Left: Hamburger */}
        <button
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
            appearance: 'none',
            outline: 'none',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src={navSidebar} alt="Menu" className="relative left-4 h-5 w-5" />
        </button>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
            appearance: 'none',
            outline: 'none',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src={aspccLogoTurqoise} alt="logo" className="relative h-10" />
        </button>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-x-6 font-semibold text-sm">
        <a href="#" className="!text-[#566273] hover:text-[#566273]">
          Programs
        </a>
        <div className="relative group">
          <button
            className="flex items-center !text-[#566273] hover:text-[#566273]"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              appearance: 'none',
              outline: 'none',
            }}
          >
            About <img src={chevron} alt="" className="ml-1 mt-1 h-3 w-3 inline-block" />
          </button>
          {/* Dropdown*/}
          <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2">
            <a href="#" className="block px-4 py-2 !text-[#566273] hover:text-[#566273]">
              Example 1
            </a>
            <a href="#" className="block px-4 py-2 !text-[#566273] hover:text-[#566273]">
              Example 2
            </a>
          </div>
        </div>
        <div className="relative group">
          <button
            className="flex items-center !text-[#566273] hover:text-[#566273]"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              appearance: 'none',
              outline: 'none',
            }}
          >
            Get Involved <img src={chevron} alt="" className="ml-1 mt-1 h-3 w-3 inline-block" />
          </button>
          <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2">
            <a href="#" className="block px-4 py-2 !text-[#566273] hover:text-[#566273]">
              Example 1
            </a>
            <a href="#" className="block px-4 py-2 !text-[#566273] hover:text-[#566273]">
              Example 2
            </a>
          </div>
        </div>

        {/* Right: Donate button and logo */}
        <div className="flex items-center">
          <button
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              appearance: 'none',
              outline: 'none',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img src={donateButton} alt="donate" className="relative h-7" />
          </button>
        </div>
        <SignedOut>
          <button
            className="flex items-center !text-[#566273] hover:text-[#566273]"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              appearance: 'none',
              outline: 'none',
            }}
            onClick={() => handleSignInClick()}
          >
            Sign-In
          </button>
        </SignedOut>
        <SignedIn>
          <UserButton userProfileUrl="/account"></UserButton>
        </SignedIn>
      </div>
    </nav>
  );
}
