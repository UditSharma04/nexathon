import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import DashboardLayout from '../dashboard/DashboardLayout';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different item types
const createCustomIcon = (count, allAvailable) => {
  const size = count > 1 ? 32 : 24;
  const color = allAvailable ? '#10B981' : '#EF4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${count > 1 ? '12px' : '0px'};
      ">
        ${count > 1 ? count : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2],
  });
};

// Group items by location
const groupItemsByLocation = (items) => {
  const groups = {};
  items.forEach(item => {
    if (!item.location || !item.location.coordinates) return;
    
    const key = `${item.location.coordinates[1]},${item.location.coordinates[0]}`;
    if (!groups[key]) {
      groups[key] = {
        items: [],
        coordinates: [item.location.coordinates[1], item.location.coordinates[0]]
      };
    }
    groups[key].items.push(item);
  });
  return groups;
};

// Default coordinates (will be updated with IP location)
const DEFAULT_LOCATION = {
  lat: 0,
  lng: 0
};

// Stadia Maps Dark style with brighter text
const DARK_MAP_STYLE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Component to handle map center updates
function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function Map() {
  const [center, setCenter] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all available items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemsAPI.getAllItems();
        const validItems = response.data.filter(item => item.location && item.location.coordinates);
        setItems(validItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    async function getLocation() {
      setLoading(true);

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by your browser');
        fallbackToIP();
        return;
      }

      // Request permission explicitly
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permissionStatus.state === 'denied') {
          console.log('Location permission denied');
          fallbackToIP();
          return;
        }

        // Get position with shorter timeout
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`
              );
              const data = await response.json();
              setLocationName(data.display_name);
            } catch (error) {
              console.error('Reverse geocoding error:', error);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Position error:', error);
            fallbackToIP();
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );

      } catch (error) {
        console.error('Permission error:', error);
        fallbackToIP();
      }
    }

    // IP fallback function
    async function fallbackToIP() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
          setCenter({
            lat: data.latitude,
            lng: data.longitude
          });
          setLocationName(`${data.city}, ${data.region}, ${data.country_name}`);
        }
      } catch (error) {
        console.error('IP location error:', error);
        // Set a default location if everything fails
        setCenter({
          lat: 12.8406, // Default coordinates
          lng: 80.1534
        });
        setLocationName('Default Location');
      } finally {
        setLoading(false);
      }
    }

    getLocation();
  }, []);

  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const newLocation = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
    setCenter(newLocation);
    setShowLocationInput(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-2rem)] bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 flex items-center justify-center">
          <div className="text-white">Detecting your location...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative h-[calc(100vh-2rem)] bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
        {/* Search Location Button */}
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={() => setShowLocationInput(true)}
            className="bg-dark-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-dark-700/50 text-white hover:bg-dark-700/80 transition-colors"
          >
            Change Location
          </button>
        </div>

        {/* Map Container */}
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
          className="map-dark"
        >
          <TileLayer
            url={DARK_MAP_STYLE}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />
          <MapCenter center={center} />
          
          {/* User's Location Marker */}
          <Marker position={center}>
            <Popup>
              <div className="text-dark-900">
                <strong>Your Location</strong>
                <p>{locationName}</p>
              </div>
            </Popup>
          </Marker>

          {/* Item Markers */}
          {Object.values(groupItemsByLocation(items)).map((group) => (
            <Marker
              key={`${group.coordinates[0]}-${group.coordinates[1]}`}
              position={group.coordinates}
              icon={createCustomIcon(
                group.items.length,
                group.items.every(item => item.status === 'available')
              )}
            >
              <Popup className="custom-popup">
                <div className="bg-dark-800/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl border border-indigo-500/20 w-[320px] max-h-[480px]">
                  {/* Header with count */}
                  <div className="px-4 py-3 border-b border-dark-700/50 bg-dark-900/50 backdrop-blur-sm">
                    <h3 className="text-white font-medium">
                      {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'} Available Here
                    </h3>
                  </div>

                  {/* Scrollable content */}
                  <div className="overflow-y-auto" style={{ maxHeight: '440px' }}>
                    {group.items.map((item, index) => (
                      <div 
                        key={item._id} 
                        className={`
                          transition-all duration-200 hover:bg-dark-700/50
                          ${index !== 0 ? 'border-t border-dark-700/50' : ''}
                        `}
                      >
                        <div className="p-4 space-y-4">
                          {/* Image and Status Badge */}
                          <div className="relative group">
                            {item.images && item.images[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-36 object-contain bg-dark-900/80 rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-36 bg-dark-900/80 rounded-lg flex items-center justify-center">
                                <svg className="w-12 h-12 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                transition-all duration-200
                                ${item.status === 'available' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 group-hover:bg-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500/30'}
                              `}>
                                {item.status === 'available' ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium text-white text-lg leading-tight">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xl font-semibold text-white">${item.price}</span>
                                <span className="text-dark-400 text-sm">/day</span>
                              </div>
                            </div>

                            {/* Owner Info */}
                            <div className="flex items-center gap-2 text-sm text-dark-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>By {item.owner?.name || 'Unknown Owner'}</span>
                            </div>

                            {/* Action Button */}
                            <Link
                              to={`/items/${item._id}`}
                              className="block w-full text-center text-white px-4 py-2.5 rounded-lg text-sm font-medium border border-indigo-500/20 hover:bg-dark-700/80 transition-all duration-200 hover:border-indigo-500/30"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Location Search Modal */}
        {showLocationInput && (
          <div className="absolute inset-0 z-[2000] bg-dark-900/90 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 w-96">
              <h3 className="text-lg font-semibold text-white mb-4">Search Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-300 mb-1">Enter city, landmark or address</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        searchLocation(searchQuery);
                      }
                    }}
                    className="w-full px-3 py-2 bg-dark-700 rounded-lg text-white"
                    placeholder="e.g. Eiffel Tower, Paris"
                  />
                  <button
                    onClick={() => searchLocation(searchQuery)}
                    className="mt-2 w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {/* Search Results */}
                {isSearching ? (
                  <div className="text-center text-dark-300">Searching...</div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        onClick={() => selectSearchResult(result)}
                        className="w-full px-4 py-3 bg-dark-700 text-left rounded-lg hover:bg-dark-600 transition-colors"
                      >
                        <div className="text-white font-medium">{result.display_name}</div>
                        <div className="text-xs text-dark-400">
                          {result.lat}, {result.lon}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowLocationInput(false);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 bg-dark-700 text-dark-300 rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

<style jsx>{`
  .map-dark {
    background-color: #1a1a1a !important;
  }
  .map-dark .leaflet-tile-pane {
    filter: brightness(0.9) contrast(1.1);
  }
  :global(.leaflet-container) {
    background: #1a1a1a !important;
  }
  :global(.leaflet-popup-content-wrapper) {
    background: rgba(26, 26, 26, 0.95);
    color: #fff;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  :global(.leaflet-popup-tip) {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  :global(.leaflet-control-zoom a) {
    background-color: rgba(26, 26, 26, 0.9) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  :global(.leaflet-control-zoom a:hover) {
    background-color: rgba(38, 38, 38, 0.9) !important;
  }
  :global(.custom-popup .leaflet-popup-content) {
    margin: 0;
    width: auto !important;
  }
`}</style>