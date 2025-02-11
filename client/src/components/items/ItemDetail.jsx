import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import BookingModal from './BookingModal';
import { itemsAPI, reviewAPI } from '../../services/api';
import { processImage } from '../../utils/imageUtils';
import ReviewList from '../reviews/ReviewList';
import ReviewForm from '../reviews/ReviewForm';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../services/api';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [processedImages, setProcessedImages] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  // Add states for editing
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  const [editedRules, setEditedRules] = useState([]);
  const [editedFeatures, setEditedFeatures] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const fetchItemAndReviews = async () => {
      try {
        setLoading(true);
        const [itemResponse, reviewsResponse] = await Promise.all([
          itemsAPI.getItem(id),
          reviewAPI.getItemReviews(id)
        ]);
        setItem(itemResponse.data);
        setReviews(reviewsResponse.data);

        // Fetch user's bookings for this item if user is logged in
        if (user) {
          const bookingsResponse = await bookingsAPI.getMyRequests();
          const itemBookings = bookingsResponse.data.filter(
            booking => booking.item._id === id
          );
          setUserBookings(itemBookings);
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndReviews();
  }, [id, user]);

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

  useEffect(() => {
    if (item) {
      setEditedRules(item.rules || []);
      setEditedFeatures(item.features || []);
    }
  }, [item]);

  const handleUpdateItem = async (updateData) => {
    try {
      const response = await itemsAPI.updateItem(id, updateData);
      setItem(response.data);
      return true;
    } catch (error) {
      setError('Failed to update item');
      return false;
    }
  };

  const handleSaveRules = async () => {
    const success = await handleUpdateItem({ rules: editedRules });
    if (success) {
      setIsEditingRules(false);
    }
  };

  const handleSaveFeatures = async () => {
    const success = await handleUpdateItem({ features: editedFeatures });
    if (success) {
      setIsEditingFeatures(false);
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setEditedRules([...editedRules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setEditedFeatures([...editedFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveRule = (index) => {
    setEditedRules(editedRules.filter((_, i) => i !== index));
  };

  const handleRemoveFeature = (index) => {
    setEditedFeatures(editedFeatures.filter((_, i) => i !== index));
  };

  // Check if user has a completed booking for this item
  const hasCompletedBooking = userBookings.some(
    booking => booking.status === 'completed' && !booking.itemReview
  );

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
              
              <div className="mt-6 grid grid-cols-3 gap-4">
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
                <div>
                  <span className="text-dark-400">Condition</span>
                  <p className="mt-1 text-2xl font-semibold text-white capitalize">
                    {item.condition || 'Good'}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Features</h3>
                {item.owner._id === user?._id && (
                  <button
                    onClick={() => setIsEditingFeatures(!isEditingFeatures)}
                    className="text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    {isEditingFeatures ? (
                      <span className="text-sm">Cancel</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {isEditingFeatures ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a new feature"
                      className="flex-1 bg-dark-900/50 border border-dark-700/50 rounded-lg px-3 py-2 text-white placeholder-dark-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                    <button
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {editedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between gap-2 bg-dark-900/30 rounded-lg px-3 py-2">
                        <span className="text-dark-200">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-dark-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveFeatures}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Save Features
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {item?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-dark-200">
                      <span className="text-primary-400">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rules */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Rules</h3>
                {item.owner._id === user?._id && (
                  <button
                    onClick={() => setIsEditingRules(!isEditingRules)}
                    className="text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    {isEditingRules ? (
                      <span className="text-sm">Cancel</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {isEditingRules ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add a new rule"
                      className="flex-1 bg-dark-900/50 border border-dark-700/50 rounded-lg px-3 py-2 text-white placeholder-dark-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                    />
                    <button
                      onClick={handleAddRule}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {editedRules.map((rule, index) => (
                      <li key={index} className="flex items-center justify-between gap-2 bg-dark-900/30 rounded-lg px-3 py-2">
                        <span className="text-dark-200">{rule}</span>
                        <button
                          onClick={() => handleRemoveRule(index)}
                          className="text-dark-400 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveRules}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Save Rules
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {item?.rules?.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2 text-dark-200">
                      <span className="text-primary-400">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Reviews</h2>
            {hasCompletedBooking && !hasReviewed && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                item={item}
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList itemId={id} type="item" />
        </div>
      </div>
    </DashboardLayout>
  );
} 