import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import BookingModal from './BookingModal';

export default function ItemDetail() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data - replace with API call
  const item = {
    id: 1,
    name: 'Power Drill',
    category: 'tools',
    status: 'available',
    description: 'Professional-grade power drill, perfect for home projects. Includes multiple drill bits and carrying case. Features variable speed control and reversible function.',
    price: 15,
    period: 'day',
    rating: 4.8,
    totalBookings: 12,
    distance: 2,
    impact: {
      moneySaved: 85,
      co2Reduced: 2.5
    },
    owner: {
      name: 'John D.',
      rating: 4.9,
      verified: true,
      responseTime: '< 1 hour',
      memberSince: 'Jan 2024',
      totalItems: 5
    },
    insurance: 200,
    condition: 'Like New',
    nextAvailable: '2024-03-15',
    location: '2 miles from you',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
      'https://images.unsplash.com/photo-1575908539614-ff89490f4a78',
    ],
    features: [
      'Variable Speed Control',
      '20V Lithium Battery',
      'LED Work Light',
      'Carrying Case Included',
      'Multiple Drill Bits'
    ],
    rules: [
      'Return in same condition',
      'Charge battery before return',
      'Clean after use',
      'Report any damage immediately'
    ],
    reviews: [
      {
        id: 1,
        user: 'Mike R.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Great drill, worked perfectly for my home project. John was very helpful with instructions.',
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 4,
        date: '1 month ago',
        comment: 'Very good condition, battery lasted longer than expected.',
      }
    ]
  };

  const [selectedImage, setSelectedImage] = useState(item.images[0]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-dark-400 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Items
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={selectedImage}
                alt={item.name}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className={`h-24 w-full object-cover rounded-lg cursor-pointer transition-opacity ${
                    selectedImage === image ? 'ring-2 ring-primary-500' : 'hover:opacity-75'
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary-400">
                      ${item.price}
                    </span>
                    <span className="text-dark-400 ml-1">
                      /{item.period}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>

                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
                  >
                    Request to Book
                  </button>

                  <div className="pt-4 border-t border-dark-700/50">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-primary-400">
                          {item.owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {item.owner.name}
                          {item.owner.verified && (
                            <svg className="ml-1 h-4 w-4 text-blue-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </p>
                        <p className="text-xs text-dark-400">
                          Response time: {item.owner.responseTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <h2 className="text-lg font-medium text-white">About this item</h2>
              <p className="mt-4 text-dark-300">{item.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-white">Features</h3>
                  <ul className="mt-2 space-y-2">
                    {item.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-dark-300">
                        <svg className="h-4 w-4 text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Rules</h3>
                  <ul className="mt-2 space-y-2">
                    {item.rules.map((rule, index) => (
                      <li key={index} className="flex items-center text-dark-300">
                        <svg className="h-4 w-4 text-dark-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Reviews</h2>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-white">{item.rating}</span>
                  <span className="mx-2 text-dark-400">•</span>
                  <span className="text-dark-400">{item.reviews.length} reviews</span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {item.reviews.map((review) => (
                  <div key={review.id} className="border-t border-dark-700/50 pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-400">
                            {review.user.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">{review.user}</p>
                          <p className="text-xs text-dark-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-white">{review.rating}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-dark-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="lg:col-span-1">
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
                  <span className="text-white">${item.impact.moneySaved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-2 text-dark-300">CO2 Reduced</span>
                  </div>
                  <span className="text-white">{item.impact.co2Reduced}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        item={item}
        selectedDate={selectedDate}
      />
    </DashboardLayout>
  );
} 