import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import BookingModal from './BookingModal';
import { itemsAPI } from '../../services/api';
import { processImage } from '../../utils/imageUtils';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [processedImages, setProcessedImages] = useState({});

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

  useEffect(() => {
    const processImages = async () => {
      if (!item) return;
      
      const processed = {};
      for (const imageUrl of item.images) {
        if (!processedImages[imageUrl]) {
          processed[imageUrl] = await processImage(imageUrl);
        }
      }
      setProcessedImages(prev => ({ ...prev, ...processed }));
    };

    processImages();
  }, [item]);

  if (loading) return (
    <DashboardLayout>
      <div>Loading...</div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="text-red-400">{error}</div>
    </DashboardLayout>
  );

  if (!item) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          to="/my-items"
          className="inline-flex items-center text-dark-400 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Items
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-900/50">
              <img
                src={processedImages[item.images[selectedImage]] || item.images[selectedImage]}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = item.images[selectedImage]; // Fallback to original image
                }}
              />
              {!processedImages[item.images[selectedImage]] && (
                <div className="absolute inset-0 bg-dark-900/50 animate-pulse" />
              )}
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
                    src={processedImages[image] || image}
                    alt={`${item.name} ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = image; // Fallback to original image
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">{item.name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'available'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-dark-300">{item.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-dark-400">Price</span>
                  <p className="mt-1 text-2xl font-semibold text-primary-400">
                    ${item.price}
                    <span className="text-sm text-dark-400">/{item.period}</span>
                  </p>
                </div>
                <div>
                  <span className="text-dark-400">Insurance Value</span>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    ${item.insurance}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <h2 className="text-lg font-medium text-white">Features</h2>
              <ul className="mt-4 space-y-2">
                {(item.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center text-dark-300">
                    <svg className="h-5 w-5 text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rules */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <h2 className="text-lg font-medium text-white">Rules</h2>
              <ul className="mt-4 space-y-2">
                {(item.rules || []).map((rule, index) => (
                  <li key={index} className="flex items-center text-dark-300">
                    <svg className="h-5 w-5 text-dark-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Borrowing History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
            <h2 className="text-lg font-medium text-white mb-4">Borrowing History</h2>
            
            {/* Mock borrowing history data */}
            {[
              {
                id: 1,
                user: {
                  name: 'John Doe',
                  image: null,
                  verified: true
                },
                startDate: '2024-02-15',
                endDate: '2024-02-18',
                rating: 5,
                review: 'Great item, worked perfectly for my project!'
              },
              {
                id: 2,
                user: {
                  name: 'Sarah Smith',
                  image: null,
                  verified: false
                },
                startDate: '2024-01-20',
                endDate: '2024-01-22',
                rating: 4,
                review: 'Very good condition, would borrow again.'
              },
              {
                id: 3,
                user: {
                  name: 'Mike Johnson',
                  image: null,
                  verified: true
                },
                startDate: '2024-01-05',
                endDate: '2024-01-08',
                rating: 5,
                review: 'Excellent experience, item was as described.'
              }
            ].map((booking) => (
              <div 
                key={booking.id} 
                className="border-t border-dark-700/50 py-4 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    {booking.user.image ? (
                      <img 
                        src={booking.user.image} 
                        alt={booking.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-primary-400">
                        {booking.user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-white truncate">
                        {booking.user.name}
                        {booking.user.verified && (
                          <svg className="ml-1 h-4 w-4 text-blue-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </p>
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`h-4 w-4 ${
                              index < booking.rating ? 'text-yellow-400' : 'text-dark-600'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-dark-300">{booking.review}</p>
                    <div className="mt-2 text-xs text-dark-400">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {item.borrowingHistory?.length === 0 && (
              <div className="text-center py-6">
                <p className="text-dark-400">No borrowing history yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Stats */}
        {item.impact && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <h2 className="text-lg font-medium text-white">Impact</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-dark-300">Money Saved</span>
                  </div>
                  <span className="text-white">${item.impact.moneySaved || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-dark-300">CO2 Reduced</span>
                  </div>
                  <span className="text-white">{item.impact?.co2Reduced || 0}kg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
  
    </DashboardLayout>
  );
} 