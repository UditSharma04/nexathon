import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import DashboardLayout from '../dashboard/DashboardLayout';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// VIT Chennai coordinates
const VIT_CHENNAI = {
  lat: 12.8406,
  lng: 80.1534
};

// Component to handle map center updates
function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function Map() {
  const [center, setCenter] = useState(VIT_CHENNAI);
  const [loading, setLoading] = useState(true);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  useEffect(() => {
    // Just set loading to false since we're not fetching any data
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-2rem)] bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 flex items-center justify-center">
          <div className="text-white">Loading map...</div>
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

        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          className="h-full w-full z-0"
          style={{ background: '#242424' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapCenter center={[center.lat, center.lng]} />
          
          {/* Current location marker */}
          <Marker position={[center.lat, center.lng]}>
            <Popup>
              <div className="text-dark-900">
                <h3 className="font-semibold">Your Location</h3>
                <p className="text-xs text-dark-500">
                  {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </DashboardLayout>
  );
} 