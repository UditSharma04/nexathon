import { useState, useEffect } from 'react';
import { reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400' : 'text-dark-600'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6">
      <div className="flex items-start gap-4">
        {/* Reviewer Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-700 flex-shrink-0">
          {review.reviewer.avatar ? (
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-500/10 text-primary-500">
              {review.reviewer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                {review.reviewer.name}
              </h4>
              <p className="text-xs text-dark-400">{formattedDate}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>

          <p className="mt-2 text-sm text-dark-300">{review.comment}</p>

          {/* If it's an item review, show the item details */}
          {review.reviewType === 'item' && review.reviewedItem && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-dark-900/30 border border-dark-800/50">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-800">
                {review.reviewedItem.images?.[0] ? (
                  <img
                    src={review.reviewedItem.images[0]}
                    alt={review.reviewedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-800 text-dark-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h5 className="text-sm font-medium text-white">
                  {review.reviewedItem.name}
                </h5>
                <p className="text-xs text-dark-400">Item Review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ReviewList({ userId, itemId, type }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      if (!userId && !itemId) {
        return;
      }

      setLoading(true);

      try {
        let response;
        
        if (type === 'item' && itemId) {
          response = await reviewAPI.getItemReviews(itemId);
        } else if (userId) {
          response = await reviewAPI.getUserReviews(userId);
        }
        
        if (isMounted && response?.data) {
          setReviews(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load reviews');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [userId, itemId, type]);

  // Filter reviews based on activeFilter
  const filteredReviews = reviews.filter(review => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'user') return review.reviewType === 'user';
    if (activeFilter === 'item') return review.reviewType === 'item';
    return true;
  });

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setActiveFilter(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeFilter === value
          ? 'bg-primary-500 text-white'
          : 'bg-dark-800/50 text-dark-300 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2 text-dark-400">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 text-center">
        <p className="text-dark-400">No reviews yet</p>
      </div>
    );
  }

  // For item reviews, just show the list without categorization
  if (type === 'item') {
    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    );
  }

  // For user profile reviews
  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <FilterButton label="All Reviews" value="all" />
        <FilterButton label="User Reviews" value="user" />
        <FilterButton label="Item Reviews" value="item" />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
} 