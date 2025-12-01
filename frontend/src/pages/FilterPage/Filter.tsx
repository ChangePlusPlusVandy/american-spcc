import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBarComponent/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import FilterComponent from '../../components/FilterComponent/FilterComponent';
import ResourceListCard from '../../components/ResourceListCardComponent/ResourceListCard';
import ResourceGridCard from '../../components/ResourceGridCardComponent/ResourceGridCard';
import { TOPIC_TO_CATEGORY, AGE_TO_ENUM } from '../../utils/filterMappings';
import viewIcon from '../../assets/view_dropdown.png';
import formatIcon from '../../assets/format_dropdown.png';
import languageIcon from '../../assets/language_dropdown.png';
import timeIcon from '../../assets/time_dropdown.png';

interface Resource {
  id: string;
  title: string;
  description?: string;
  resource_type: string;
  category: string;
  age_groups: string[];
  language: string;
  time_to_read: number;
  labels?: Array<{ label: { label_name: string } }>;
}

// SVG Icons for View dropdown options
const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#566273">
    <rect x="4" y="6" width="16" height="2" rx="1" />
    <rect x="4" y="11" width="16" height="2" rx="1" />
    <rect x="4" y="16" width="16" height="2" rx="1" />
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#566273">
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </svg>
);

function FilterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [labelSearchResults, setLabelSearchResults] = useState<Array<{id: string, label_name: string, category: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);

  // Single-select states (string | null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>('ENGLISH');

  // Multi-select states (string[])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);

  // State for resources
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown options
  const viewOptions = [
    { value: 'list', label: 'List', icon: <ListIcon /> },
    { value: 'grid', label: 'Grid', icon: <GridIcon /> },
  ];

  const formatOptions = [
    { value: 'WEBPAGE', label: 'Webpage' },
    { value: 'PDF', label: 'PDF' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'WEBINAR', label: 'Webinar' },
    { value: 'INTERACTIVE_QUIZ', label: 'Interactive Quiz' },
  ];

  const languageOptions = [
    { value: 'ENGLISH', label: 'English' },
    { value: 'SPANISH', label: 'Spanish' },
  ];

  const timeOptions = [
    { value: 'SHORT', label: 'Short <5 min' },
    { value: 'MEDIUM', label: 'Medium 5-15 min' },
    { value: 'LONG', label: 'Long >15 min' },
  ];

  // Read query parameter from URL on mount
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      setIsTyping(false);
    }
  }, [searchParams]);

  // API call to search category labels
  const searchLabels = async (query: string) => {
    if (!query.trim()) {
      setLabelSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const url = `http://localhost:8000/api/labels/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      setLabelSearchResults(data);
    } catch (error) {
      console.error('Label search error:', error);
      setLabelSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLabels(searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle clicking a label in the dropdown
  const handleLabelClick = async (labelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/resources?label_id=${labelId}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError('Failed to fetch resources for this label.');
      console.error('Error fetching resources by label:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resources when topics change OR when label_id is in URL
  useEffect(() => {
    const labelIdParam = searchParams.get('label_id');

    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      try {
        let allResources: Resource[] = [];

        // Priority 1: Fetch by label_id if present (from landing page)
        if (labelIdParam) {
          const response = await fetch(`http://localhost:8000/api/resources?label_id=${labelIdParam}`);
          if (!response.ok) throw new Error('Failed to fetch resources');
          allResources = await response.json();
        }
        // Priority 2: Fetch by selected topics (from sidebar)
        else if (selectedTopics.length > 0) {
          const categories = selectedTopics
            .map(topic => TOPIC_TO_CATEGORY[topic])
            .filter(Boolean);

          const promises = categories.map(cat =>
            fetch(`http://localhost:8000/api/resources?category=${cat}`)
              .then(res => {
                if (!res.ok) throw new Error('Failed to fetch resources');
                return res.json();
              })
          );

          const results = await Promise.all(promises);
          allResources = results.flat();
        }
        // Priority 3: Fetch ALL resources if no topics selected
        else {
          const response = await fetch(`http://localhost:8000/api/resources`);
          if (!response.ok) throw new Error('Failed to fetch resources');
          allResources = await response.json();
        }

        setResources(allResources);
      } catch (err) {
        setError('Failed to fetch resources. Please try again later.');
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedTopics, searchParams]);

  // Client-side filtering
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesDesc = resource.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Format filter (UPDATED: now array-based)
      if (selectedFormats.length > 0 && !selectedFormats.includes(resource.resource_type)) {
        return false;
      }

      // Language filter (unchanged)
      if (selectedLanguage && resource.language !== selectedLanguage) {
        return false;
      }

      // Time-to-Read filter (UPDATED: now array-based with new logic)
      if (selectedTimeRanges.length > 0) {
        const time = resource.time_to_read;
        const matchesAnyRange = selectedTimeRanges.some(range => {
          if (range === 'SHORT' && time < 5) return true;
          if (range === 'MEDIUM' && time >= 5 && time <= 15) return true;
          if (range === 'LONG' && time > 15) return true;
          return false;
        });
        if (!matchesAnyRange) return false;
      }

      // Age filter
      if (selectedAges.length > 0) {
        const ageEnums = selectedAges.map(age => AGE_TO_ENUM[age]).filter(Boolean);
        const hasMatchingAge = ageEnums.some(ageEnum =>
          resource.age_groups.includes(ageEnum)
        );
        if (!hasMatchingAge) return false;
      }

      return true;
    });
  }, [resources, searchQuery, selectedFormats, selectedLanguage, selectedTimeRanges, selectedAges]);

  const handleLearnMore = (id: string) => {
    console.log('Navigate to resource:', id);
    // TODO: Navigate to resource detail page
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <NavBar />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-6 w-4/5 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                // Navigate with search query (same as landing page)
                navigate(`/filter?q=${encodeURIComponent(searchQuery)}`);
                setLabelSearchResults([]);
                setIsTyping(false);
              }
            }}
            className="relative"
          >
            <SearchBar
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                setIsTyping(true);
              }}
              placeholder="Search..."
              size="small"
              borderColor="#000000"
              borderWidth="1px"
              backgroundColor="#00a0a0"
              fontSize="14px"
              textColor="#000000"
            />

            {/* Search Results Dropdown */}
            {searchQuery && labelSearchResults.length > 0 && isTyping && (
              <div className="absolute left-0 right-0 mt-2 z-50">
                <div className="rounded-lg shadow-lg border-2 border-[#C8DC59] overflow-hidden bg-white">
                  {labelSearchResults.map((label, index) => (
                    <div key={label.id}>
                      <button
                        type="button"
                        onClick={() => {
                          handleLabelClick(label.id);
                          setSearchQuery('');
                          setLabelSearchResults([]);
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
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          transition: 'background-color 0.2s',
                          border: 'none',
                          outline: 'none',
                        }}
                        className="w-full text-left py-3"
                      >
                        {label.label_name}
                      </button>
                      {index !== labelSearchResults.length - 1 && (
                        <div style={{ height: '2px', backgroundColor: '#C8DC59' }}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Filter Action Bar */}
        <div className="flex gap-6 mb-6">
          <div className="flex-shrink-0 mr-4" style={{ width: '300px' }}></div>
          <div className="flex-1">
            <div className="flex gap-3">
              <FilterDropdown
                label="View"
                icon={<img src={viewIcon} alt="View" style={{ width: '24px', height: '24px' }} />}
                options={viewOptions}
                selected={viewMode}
                onChange={(value) => setViewMode(value as 'list' | 'grid')}
                multiSelect={false}
              />
              <FilterDropdown
                label="Format"
                icon={<img src={formatIcon} alt="Format" style={{ width: '24px', height: '24px' }} />}
                options={formatOptions}
                selected={selectedFormats}
                onChange={(value) => setSelectedFormats(value as string[])}
                multiSelect={true}
              />
              <FilterDropdown
                label="Language"
                icon={<img src={languageIcon} alt="Language" />}
                options={languageOptions}
                selected={selectedLanguage}
                onChange={(value) => setSelectedLanguage(value as string)}
                multiSelect={false}
              />
              <FilterDropdown
                label="Time-to-Read"
                icon={<img src={timeIcon} alt="Time to Read" />}
                options={timeOptions}
                selected={selectedTimeRanges}
                onChange={(value) => setSelectedTimeRanges(value as string[])}
                multiSelect={true}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="flex-shrink-0 mr-4">
            <FilterComponent
              selectedTopics={selectedTopics}
              selectedAges={selectedAges}
              onTopicChange={setSelectedTopics}
              onAgeChange={setSelectedAges}
            />
          </div>

          {/* Right Content - Resources */}
          <div className="flex-1">
            {loading && (
              <div className="text-center py-12">
                <p className="text-lg text-[#566273]">Loading resources...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            )}

            {!loading && !error && filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">
                  No resources found. Try adjusting your filters.
                </p>
              </div>
            )}

            {!loading && !error && filteredResources.length > 0 && (
              <>
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {filteredResources.map(resource => (
                      <ResourceListCard
                        key={resource.id}
                        title={resource.title}
                        description={resource.description || 'No description available'}
                        tags={resource.labels?.map(l => l.label.label_name) || []}
                        imageUrl="https://placehold.co/600x400/4db8a8/ffffff?text=Resource"
                        onLearnMore={() => handleLearnMore(resource.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredResources.map(resource => (
                      <ResourceGridCard
                        key={resource.id}
                        title={resource.title}
                        tags={resource.labels?.map(l => l.label.label_name) || []}
                        imageUrl="https://placehold.co/600x400/4db8a8/ffffff?text=Resource"
                        onLearnMore={() => handleLearnMore(resource.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPage;
