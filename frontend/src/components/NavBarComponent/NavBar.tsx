import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import navSidebar from '../../assets/nav_sidebar_button.png';
import aspccLogoTurqoise from '../../assets/aspcc_logo_turqois.png';
import chevron from '../../assets/chevron.png';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import Sidebar from '../SidebarComponent/Sidebar';
import Button from '../ButtonComponent/Button';
import { ButtonColor, ButtonVariant } from '../ButtonComponent/ButtonDefinitions';
import { Shield } from 'lucide-react';
export default function DefaultNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate('/sign-in');
  };

  return (
    <>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav className="sticky top-0 z-50 w-full bg-[#FFF9F0] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-10">
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
            onClick={() => setMenuOpen(true)}
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
            onClick={() => window.open('https://americanspcc.org/', '_blank')}
          >
            <img src={aspccLogoTurqoise} alt="logo" className="relative h-10" />
          </button>
        </div>
        <div className="flex items-center gap-x-6 font-semibold text-sm">
          <button
            className="flex items-center !text-[#566273]"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              appearance: 'none',
              outline: 'none',
            }}
            onClick={() => navigate('/')}
          >
            Programs
          </button>
          <div className="relative group inline-block">
            <button
              className="flex items-center !text-[#566273]"
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
            <div className="absolute left-0 top-full h-2 w-full"></div>
            <div
              className="
                absolute left-0 top-[calc(100%+8px)]
                w-72
                rounded-none
                bg-[#FFF9F0]
                shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                py-3
                z-50
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-opacity duration-150
              "
            >
              <a
                href="https://americanspcc.org/about/#what"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                What We Do
              </a>

              <a
                href="https://americanspcc.org/about/#impact"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Our Reach
              </a>
              <a
                href="https://americanspcc.org/about/#team"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Our Team
              </a>
              <a
                href="https://americanspcc.org/about/#partners"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Parents & Sponsors
              </a>
              <a
                href="https://americanspcc.org/our-impact/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Our Impact
              </a>
              <a
                href="https://americanspcc.org/in-the-media/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                In the Media
              </a>
              <a
                href="https://americanspcc.org/championforchildrenawards/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Champion for Children Award
              </a>
            </div>
          </div>
          <div className="relative group inline-block">
            <button
              className="flex items-center !text-[#566273]"
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
              Get Involved
              <img src={chevron} alt="" className="ml-1 mt-1 h-3 w-3 inline-block" />
            </button>
            <div className="absolute left-0 top-full h-2 w-full"></div>
            <div
              className="
              absolute left-0 top-[calc(100%+8px)]
              w-72
              rounded-none
              bg-[#FFF9F0]
              shadow-[0_8px_24px_rgba(0,0,0,0.12)]
              py-3
              z-50
              opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              transition-opacity duration-150
            "
            >
              <a
                href="https://americanspcc.org/community/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Community
              </a>
              <a
                href="https://americanspcc.org/donate/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Take Action
              </a>
              <a
                href="https://americanspcc.org/parentcoaching/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Support Peaceful Discipline
              </a>
              <a
                href="https://americanspcc.org/advocacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Advocate
              </a>
              <a
                href="https://americanspcc.org/virtual-volunteer-application/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Virtual Volunteer
              </a>

              <a
                href="https://americanspcc.org/national-child-abuse-prevention-month/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 !text-[#566273] hover:bg-gray-100"
              >
                Child Abuse Prevention Month
              </a>
            </div>
          </div>
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
            <UserButton
              userProfileUrl="/account"
              appearance={{
                elements: {
                  userButtonPopoverFooter: { display: 'none' },
                  ...(isAdmin && {
                    userButtonPopoverActionButton__manageAccount: {
                      display: 'none',
                    },
                  }),
                },
              }}
            >
              <UserButton.MenuItems>
                {isAdmin && (
                  <UserButton.Link
                    label="Admin Center"
                    labelIcon={<Shield size={16} />}
                    href="/admin/admin-center"
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>
    </>
  );
}
