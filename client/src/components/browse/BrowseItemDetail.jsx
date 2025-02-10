import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import { itemsAPI } from '../../services/api';
import BookingModal from '../items/BookingModal';

export default function BrowseItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemsAPI.getItem(id);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch item details');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-dark-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!item) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-dark-400">Item not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-900/50">
              <img
                src={item.images[selectedImage]}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {item.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary-500' 
                      : 'hover:opacity-75'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${item.name} ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{item.name}</h1>
              <p className="mt-2 text-dark-300">{item.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-500">${item.price}</span>
                <span className="text-dark-400">/{item.period}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'available' 
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Owner Info */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">Owner</h3>
                  <p className="text-dark-300">{item.owner.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-dark-400">Response time:</span>
                    <span className="text-sm text-white">{item.owner.responseTime || '< 1 hour'}</span>
                  </div>
                </div>
                {item.owner.verified && (
                  <div className="flex items-center gap-1 text-primary-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Features</h3>
                <ul className="space-y-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-dark-300">
                      <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules */}
            {item.rules && item.rules.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Rules</h3>
                <ul className="space-y-2">
                  {item.rules.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2 text-dark-300">
                      <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={item.status !== 'available'}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.status === 'available' ? 'Book Now' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        item={item}
      />
    </DashboardLayout>
  );
} 