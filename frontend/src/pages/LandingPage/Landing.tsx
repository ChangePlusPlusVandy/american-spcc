import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import homepageBackground from '../../assets/SPCC - Homepage.png';
import searchIcon from '../../assets/search_icon.png';
import NavBar from '../../components/NavBarComponent/NavBar.tsx';

function Landing() {
  return (
    <div className="min-w-screen relative min-h-screen overflow-y-auto bg-[#6EC6C5]">
      <NavBar />
      {/* Image background */}
      <div
        className="relative h-[370px] bg-cover w-full [background-position:50%_20%]"
        style={{ backgroundImage: `url(${homepageBackground})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 w-full bg-white/80"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <h1
            className="text-center mt-50 text-[#566273]"
            style={{ fontSize: '65px', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}
          >
            Parenting Resource Center
          </h1>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative p-2">
        <form action="/search" className="w-57/100 z-30 -mt-12 mx-auto px-4 left-0 right-0">
          <div className="relative">
            <input
              type="text"
              name="q"
              className="[box-shadow:0px_4px_4px_0px_#00000040] mx-auto w-full border-[5px] h-[10vh] p-[35.5px] shadow rounded-full text-[#566273] border-[#55C3C0] bg-[#FFF9F0] focus:outline-none placeholder-[#566273] text-[20px]"
              placeholder="Type your question here..."
            />
            <button
              type="submit"
              className="absolute top-7 right-7 h-5 w-5"
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
              <img src={searchIcon} alt="Search" />
            </button>
          </div>
        </form>
      </div>

      {/* Hot topics */}
      <div className="relative -mt-0 z-30 px-2 md:px-8 pb-9 bg-[#6EC6C5]">
        <div>
          <h2
            className="font-extrabold font-[Suez_One] text-[#566273] mb-6"
            style={{
              fontFamily: 'Suez One',
              fontWeight: 1000,
              fontStyle: 'Regular',
              fontSize: '25px',
            }}
          >
            Hot Topics
          </h2>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F7E9D7] shadow p-4 w-full h-64 items-center justify-center"></div>
          <div className="bg-[#F7E9D7] shadow p-4 w-full h-64 items-center justify-center"></div>
          <div className="bg-[#F7E9D7] shadow p-4 w-full h-64 items-center justify-center"></div>{' '}
        </div>
      </div>
    </div>
  );
}

export default Landing;
