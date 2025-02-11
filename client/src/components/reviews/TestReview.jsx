import { useState, useEffect } from 'react';
import { reviewAPI } from '../../services/api';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

export default function TestReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Replace with actual IDs from your database
  const testItemId = 'YOUR_TEST_ITEM_ID';
  const testBooking = {
    _id: 'YOUR_TEST_BOOKING_ID',
    // other booking properties...
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getItemReviews(testItemId);
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await reviewAPI.createReview(reviewData);
      await loadReviews(); // Reload reviews after submission
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <ReviewForm 
        booking={testBooking}
        onSubmit={handleSubmitReview}
        onCancel={() => {}}
      />
      <ReviewList reviews={reviews} />
    </div>
  );
} 