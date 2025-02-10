import { useState } from 'react';
import { bookingsAPI } from '../../services/api';

export default function BookingModal({ isOpen, onClose, item }) {
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    message: '',
    paymentMethod: 'paypal',
    agreeToTerms: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Return null or loading state if item is not available
  if (!item) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (item.period === 'hour' && (!formData.startTime || !formData.endTime)) {
        throw new Error('Please select both start and end times');
      }

      if (!formData.startDate || !formData.endDate) {
        throw new Error('Please select both start and end dates');
      }

      // Create start and end datetime objects
      const startDateTime = new Date(formData.startDate);
      const endDateTime = new Date(formData.endDate);

      if (item.period === 'hour') {
        const [startHours, startMinutes] = formData.startTime.split(':');
        const [endHours, endMinutes] = formData.endTime.split(':');
        
        startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
      }

      // Validate that end time is after start time
      if (endDateTime <= startDateTime) {
        throw new Error('End time must be after start time');
      }

      // Create booking request data
      const bookingData = {
        itemId: item._id,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        message: formData.message.trim(),
        period: item.period
      };

      const response = await bookingsAPI.createRequest(item._id, bookingData);
      console.log('Booking request created:', response.data);
      onClose();
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-dark-800/50 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Book {item.name}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            {/* Time Selection for Hourly Bookings */}
            {item.period === 'hour' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Message to Owner
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-dark-900/50 border border-dark-700/50 rounded-lg px-4 py-2 text-white focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Introduce yourself and explain your need for the item..."
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-700/50 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-dark-300">
                I agree to the terms and conditions
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-dark-300 bg-dark-700/50 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.agreeToTerms}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 