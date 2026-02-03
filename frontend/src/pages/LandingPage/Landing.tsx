import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import homepageBackground from '../../assets/SPCC - Homepage.png';
import searchIcon from '../../assets/search_icon.png';
import { API_BASE_URL } from '@/config/api';

interface Resource {
  id: string;
  title: string;
  description?: string | null;
  hosting_type: 'EXTERNAL' | 'INTERNAL' | 'OTHER';
  externalResources?: { external_url: string } | null;
  imageUrl?: string | null;
}

function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Fetch featured "Getting Started" resources
  useEffect(() => {
    const fetchFeaturedResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources/featured`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedResources(data);
        }
      } catch (error) {
        console.error('Error fetching featured resources:', error);
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchFeaturedResources();
  }, []);

  const searchResources = async (query: string) => {
    if (!query.trim()) {
      console.log('Empty query, clearing results');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = `${API_BASE_URL}/api/resources/search?q=${encodeURIComponent(query)}`;
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchResources(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('State updated - searchQuery:', searchQuery);
    console.log('State updated - searchResults:', searchResults);
    console.log('State updated - isSearching:', isSearching);
  }, [searchQuery, searchResults, isSearching]);

  return (
    <div className="min-w-screen relative min-h-screen bg-[#6EC6C5]">
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
          <div ref={searchRef} className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const trimmed = searchQuery.trim();

                if (trimmed) {
                  navigate(`/filter?q=${encodeURIComponent(trimmed)}`);
                } else {
                  navigate('/filter');
                }

                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="[box-shadow:0px_4px_4px_0px_#00000040] mx-auto w-full border-[5px] h-[10vh] p-[35.5px] shadow rounded-full text-[#566273] border-[#55C3C0] bg-[#FFF9F0] focus:outline-none placeholder-[#566273] text-[20px]"
                  placeholder="Type a topic here..."
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
                  {searchResults.slice(0, 5).map((resource, index) => (
                    <div key={resource.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (resource.hosting_type === 'EXTERNAL') {
                            const url = resource.externalResources?.external_url;
                            if (!url) return;

                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            navigate(`/resource/${resource.id}`);
                          }

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
                        <div className="font-semibold">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {resource.description}
                          </div>
                        )}
                      </button>

                      {index !== searchResults.length - 1 && (
                        <div style={{ height: '2px', backgroundColor: '#C8DC59' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started */}
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
            Getting Started
          </h2>
        </div>
        <div
          className="flex gap-6 overflow-x-auto pb-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#566273 #F7E9D7',
          }}
        >
          {isFeaturedLoading ? (
            // Loading placeholders
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 h-64 bg-[#F7E9D7] shadow rounded-lg animate-pulse"
              />
            ))
          ) : featuredResources.length > 0 ? (
            featuredResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => {
                  if (
                    resource.hosting_type === 'EXTERNAL' &&
                    resource.externalResources?.external_url
                  ) {
                    window.open(
                      resource.externalResources.external_url,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  } else {
                    navigate(`/resource/${resource.id}`);
                  }
                }}
                className="flex-shrink-0 w-64 h-64 bg-[#F7E9D7] shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[#55C3C0]"
              >
                <div className="relative w-full h-full flex flex-col">
                  {/* Image */}
                  <div className="flex-1 w-full overflow-hidden">
                    {resource.imageUrl ? (
                      <img
                        src={resource.imageUrl}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8D9C5] flex items-center justify-center">
                        <span className="text-[#566273] text-4xl">📚</span>
                      </div>
                    )}
                  </div>
                  {/* Title at bottom */}
                  <div className="w-full p-3 bg-[#F7E9D7]">
                    <p
                      className="text-[#566273] text-sm font-semibold text-center line-clamp-2"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {resource.title}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Fallback if no resources found
            <p className="text-[#566273]">No featured resources available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
