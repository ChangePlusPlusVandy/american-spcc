import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homepageBackground from '../../assets/SPCC - Homepage.png';
import searchIcon from '../../assets/search_icon.png';
import NavBar from '../../components/NavBarComponent/NavBar.tsx';

interface CategoryLabel {
  id: string;
  label_name: string;
  category: string;
}

function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CategoryLabel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // API call to search resource titles
  const searchResources = async (query: string) => {
    console.log('searchResources called with query:', query);

    if (!query.trim()) {
      console.log('Empty query, clearing results');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = `http://localhost:8000/api/labels/search?q=${encodeURIComponent(query)}`;
      console.log('Fetching from:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', data);
      console.log('Number of results:', data.length);

      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchResources(searchQuery);
    }, 300); // 300ms debounce delay

    // Cleanup function to cancel the previous timeout
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('State updated - searchQuery:', searchQuery);
    console.log('State updated - searchResults:', searchResults);
    console.log('State updated - isSearching:', isSearching);
  }, [searchQuery, searchResults, isSearching]);

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
      <div className="relative p-2 z-40">
        <div className="w-57/100 -mt-12 mx-auto px-4">
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/filter?q=${encodeURIComponent(searchQuery)}`);
                  setSearchQuery('');
                  setSearchResults([]);
                }
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Search Results */}
            {(() => {
              const shouldShow = searchQuery && searchResults.length > 0;
              console.log('Dropdown condition check:', {
                searchQuery,
                resultsLength: searchResults.length,
                shouldShow,
              });
              return shouldShow;
            })() && (
              <div className="absolute left-0 right-0 mt-2 z-50">
                <div
                  className="rounded-lg shadow-lg border-2 border-[#C8DC59] overflow-hidden"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  {searchResults.map((label, index) => (
                    <div key={label.id}>
                      <button
                        onClick={() => {
                          navigate(`/filter?label_id=${label.id}`);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                        style={{
                          backgroundColor: '#FFFFFF',
                          fontFamily: 'Open Sans, sans-serif',
                          color: '#566273',
                          paddingLeft: '35.5px',
                          paddingRight: '35.5px',
                          transition: 'background-color 0.2s',
                          border: 'none',
                          outline: 'none',
                        }}
                        className="w-full text-left py-3"
                      >
                        {label.label_name}
                      </button>
                      {index !== searchResults.length - 1 && (
                        <div style={{ height: '2px', backgroundColor: '#C8DC59' }}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
