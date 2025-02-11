import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import Portal from '../common/Portal';

export default function ReviewForm({ 
  booking, 
  reviewType,
  reviewedUser,
  reviewedItem,
  onSubmit, 
  onCancel 
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        bookingId: booking._id,
        rating,
        comment,
        reviewType,
        ...(reviewType === 'user' && { reviewedUser: reviewedUser._id }),
        ...(reviewType === 'item' && { reviewedItem: reviewedItem._id })
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm transition-opacity" 
            aria-hidden="true"
            onClick={onCancel}
          />

          {/* Modal panel */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
          <div className="relative inline-block align-bottom bg-dark-800/50 backdrop-blur-xl rounded-xl border border-dark-700/50 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-dark-400 hover:text-white focus:outline-none"
                onClick={onCancel}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Write a Review for {reviewType === 'user' ? reviewedUser?.name : reviewedItem?.name}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                        >
                          <svg 
                            className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-dark-600'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg p-3 text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Write your review here..."
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={onCancel}
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-dark-700 shadow-sm px-4 py-2 bg-dark-800 text-base font-medium text-dark-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
} 