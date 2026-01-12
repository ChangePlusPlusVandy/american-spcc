import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import CreateCollection from '@/components/CreateCollectionComponent/CreateCollection';
import SaveToast from '@/components/SaveToastComponent/SaveToast';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@clerk/clerk-react';
import { useRef } from 'react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  resource_type: string;
  hosting_type: 'EXTERNAL' | 'INTERNAL' | 'OTHER';
  category: string;
  age_groups: string[];
  language: string;
  time_to_read: number;
  imageUrl?: string | null;
  labels?: Array<{ label: { label_name: string } }>;
  externalResources?: { external_url: string } | null;
}

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
  const selectedTopics = useMemo(() => {
    return searchParams.getAll('category');
  }, [searchParams]);
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [collectionNames, setCollectionNames] = useState<string[]>([]);
  const [labelSearchResults, setLabelSearchResults] = useState<
    Array<{ id: string; label_name: string; category: string }>
  >([]);
  const [resourceSearchResults, setResourceSearchResults] = useState<Resource[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewOptions = [
    { value: 'list', label: 'List', icon: <ListIcon /> },
    { value: 'grid', label: 'Grid', icon: <GridIcon /> },
  ];
  const [saveToast, setSaveToast] = useState<{
    open: boolean;
    collectionName: string;
    imageUrl?: string;
    undo?: () => void;
  } | null>(null);
  
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [createCollectionImage, setCreateCollectionImage] = useState<string | undefined>();
    const [createCollectionResourceId, setCreateCollectionResourceId] = useState<string | null>(null);
    const [toastClosing, setToastClosing] = useState(false);
    const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<Set<string>>(new Set());
    const handleBookmarkChange = (resourceId: string, isBookmarked: boolean) => {
      setBookmarkedResourceIds(prev => {
        const next = new Set(prev);
        if (isBookmarked) {
          next.add(resourceId);
        } else {
          next.delete(resourceId);
        }
        return next;
      });
    };
    const { getToken } = useAuth();


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

    
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
  
      try {
        let allResources: Resource[] = [];
  
        if (selectedTopics.length > 0) {
          const results = await Promise.all(
            selectedTopics.map((category) =>
              fetch(`${API_BASE_URL}/api/resources?category=${category}`)
                .then((res) => res.json())
            )
          );
        
          allResources = results.flat();
        } else {
          const res = await fetch(`${API_BASE_URL}/api/resources`);
          allResources = await res.json();
        }
        
  
        setResources(allResources);
      } catch {
        setError('Failed to fetch resources.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchResources();
  }, [selectedTopics]);
  
  
    
  
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      setIsTyping(false);
    }
  }, [searchParams]);



  const searchResources = async (query: string) => {
    if (!query.trim()) {
      setResourceSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resources/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResourceSearchResults(data);
    } catch (error) {
      console.error('Resource search error:', error);
      setResourceSearchResults([]);
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

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(q);
        const matchesDescription =
          resource.description?.toLowerCase().includes(q) ?? false;
  
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }
  
      if (selectedFormats.length > 0 && !selectedFormats.includes(resource.resource_type)) {
        return false;
      }
  
      if (selectedLanguage && resource.language !== selectedLanguage) {
        return false;
      }

      if (selectedTimeRanges.length > 0) {
        const time = resource.time_to_read;
        const matchesAnyRange = selectedTimeRanges.some((range) => {
          if (range === 'SHORT' && time < 5) return true;
          if (range === 'MEDIUM' && time >= 5 && time <= 15) return true;
          if (range === 'LONG' && time > 15) return true;
          return false;
        });
        if (!matchesAnyRange) return false;
      }
  
      if (selectedAges.length > 0) {
        const ageEnums = selectedAges
          .map((age) => AGE_TO_ENUM[age])
          .filter(Boolean);
        const hasMatchingAge = ageEnums.some((ageEnum) =>
          resource.age_groups.includes(ageEnum)
        );
        if (!hasMatchingAge) return false;
      }
  
      return true;
    });
  }, [
    resources,
    searchQuery,
    selectedFormats,
    selectedLanguage,
    selectedTimeRanges,
    selectedAges,
  ]);


  const handleLearnMore = (resource: Resource) => {
    if (resource.hosting_type !== 'EXTERNAL') {
      return;
    }

    const url = resource.externalResources?.external_url;
    if (!url) return;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResourceSaved = ({
    collectionName,
    imageUrl,
    undo,
    resourceId,
  }: {
    collectionName: string;
    imageUrl?: string;
    undo: () => void;
    resourceId: string;
  }) => {
  
    setSaveToast({
      open: true,
      collectionName,
      imageUrl,
      undo: async () => {
        await undo();
        handleBookmarkChange(resourceId, false);
      },
      
      
    });
  
    setTimeout(() => {
      setToastClosing(true);
      setTimeout(() => {
        setSaveToast(null);
        setToastClosing(false);
      }, 200);
    }, 3000);
  };
  
  
  

  return (
    <div className="min-h-screen bg-[#FFF9F0]">

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 w-4/5 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const trimmed = searchQuery.trim();

              if (trimmed) {
                navigate(`/filter?q=${encodeURIComponent(trimmed)}`);
              } else {
                navigate('/filter');
                setSearchQuery('');
              }

              setIsTyping(false);
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
            {searchQuery && resourceSearchResults.length > 0 && isTyping && (
              <div className="absolute left-0 right-0 mt-2 z-50">
                <div className="rounded-lg shadow-lg border-2 border-[#C8DC59] overflow-hidden bg-white">
                  {resourceSearchResults.map((resource, index) => (
                    <div key={resource.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (resource.hosting_type !== 'EXTERNAL') return;

                          const url = resource.externalResources?.external_url;
                          if (!url) return;

                          window.open(url, '_blank', 'noopener,noreferrer');
                          setSearchQuery('');
                          setResourceSearchResults([]);
                        }}
                        className="w-full text-left py-3 px-5 hover:bg-gray-100"
                      >
                        <div className="font-semibold">{resource.title}</div>
                        {resource.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {resource.description}
                          </div>
                        )}
                      </button>

                      {index !== resourceSearchResults.length - 1 && (
                        <div style={{ height: '2px', backgroundColor: '#C8DC59' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
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
                icon={
                  <img src={formatIcon} alt="Format" style={{ width: '24px', height: '24px' }} />
                }
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
        <div className="flex gap-6">
          <div className="flex-shrink-0 mr-4">
          <FilterComponent
            selectedTopics={selectedTopics}
            selectedAges={selectedAges}
            onTopicChange={(topics) => {
              const params = new URLSearchParams(searchParams);
            
              params.delete('category');
            
              topics.forEach((t) => {
                params.append('category', t);
              });
            
              navigate(`/filter?${params.toString()}`, { replace: true });
            }}
            
            onAgeChange={setSelectedAges}
          />


          </div>

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
                    {filteredResources.map((resource) => (
                      <ResourceListCard
                        key={resource.id}
                        id={resource.id}
                        title={resource.title}
                        description={resource.description || 'No description available'}
                        tags={resource.labels?.map((l) => l.label.label_name) || []}
                        category={resource.category}
                        imageUrl={resource.imageUrl ?? undefined}

                        isBookmarked={bookmarkedResourceIds.has(resource.id)}
                        onBookmarkChange={(isBookmarked) =>
                          handleBookmarkChange(resource.id, isBookmarked)
                        }

                        onLearnMore={() => handleLearnMore(resource)}
                        onSaved={({ collectionName, imageUrl, undo }) =>
                          handleResourceSaved({
                            collectionName,
                            imageUrl,
                            undo,
                            resourceId: resource.id,
                          })
                        }
                      />

                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredResources.map((resource) => {

                      return (
                      <ResourceGridCard
                        key={resource.id}
                        id={resource.id}
                        title={resource.title}
                        description={resource.description || ''}
                        tags={resource.labels?.map((l) => l.label.label_name) || []}
                        category={resource.category}
                        imageUrl={resource.imageUrl ?? undefined}
                        isBookmarked={bookmarkedResourceIds.has(resource.id)}
                        onLearnMore={() => handleLearnMore(resource)}
                        onSaved={({ collectionName, imageUrl, undo }) =>
                          handleResourceSaved({
                            collectionName,
                            imageUrl,
                            undo,
                            resourceId: resource.id,
                          })
                        }
                        onBookmarkChange={(isBookmarked) =>
                          handleBookmarkChange(resource.id, isBookmarked)
                        }
                      />




                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SaveToast
        open={!!saveToast}
        collectionName={saveToast?.collectionName ?? ''}
        imageUrl={saveToast?.imageUrl}
        onUndo={saveToast?.undo}
      />


      <CreateCollection
        isOpen={showCreateCollection}
        existingNames={collectionNames}
        imageUrl={createCollectionImage}
        onCancel={() => setShowCreateCollection(false)}
        onCreate={async (name) => {
          try {
            const token = await getToken();
            if (!token) return;
        
            const res = await fetch(`${API_BASE_URL}/api/collections`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name }),
            });
        
            if (!res.ok) throw new Error('Create collection failed');
        
            const newCollection = await res.json();
            let createdItemId: string | null = null;
        
            if (createCollectionResourceId) {
              const itemRes = await fetch(
                `${API_BASE_URL}/api/collections/${newCollection.id}/items`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    resource_fk: createCollectionResourceId,
                  }),
                }
              );
        
              const createdItem = await itemRes.json();
              createdItemId = createdItem.id;
            }
        
            setSaveToast({
              open: true,
              collectionName: newCollection.name,
              imageUrl: createCollectionImage,
              undo: async () => {
                if (!createdItemId) return;
        
                const token = await getToken();
                if (!token) return;
        
                await fetch(
                  `${API_BASE_URL}/api/collections/items/${createdItemId}`,
                  {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              },
            });
        
            setTimeout(() => {
              setToastClosing(true);
              setTimeout(() => {
                setSaveToast(null);
                setToastClosing(false);
              }, 200);
            }, 3000);
        
            setShowCreateCollection(false);
            setCreateCollectionResourceId(null);
          } catch (err) {
            console.error('Failed to create collection + save resource', err);
          }
        }}
        
      />
    </div>
  );
}

export default FilterPage;
