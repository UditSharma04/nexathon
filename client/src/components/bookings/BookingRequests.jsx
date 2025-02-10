import { useState, useEffect } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { bookingsAPI } from '../../services/api';

export default function BookingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const response = await bookingsAPI.getIncomingRequests();
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await bookingsAPI.updateRequestStatus(requestId, 'accepted');
      // Refresh the requests list
      fetchBookingRequests();
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await bookingsAPI.updateRequestStatus(requestId, 'declined');
      // Refresh the requests list
      fetchBookingRequests();
    } catch (err) {
      console.error('Error declining request:', err);
      setError('Failed to decline request');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading requests...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Booking Requests</h1>
            <p className="mt-1 text-sm text-dark-300">
              Review and manage incoming booking requests
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            {error}
          </div>
        )}

        {/* No Requests Message */}
        {requests.length === 0 && !error && (
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 text-center">
            <p className="text-dark-300">No booking requests found</p>
          </div>
        )}

        {/* Requests List */}
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative">
                <div className="flex items-start gap-6">
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-dark-900/50">
                    <img
                      src={request.item.images[0]}
                      alt={request.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {request.item.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm text-dark-300">Requested by</span>
                          <span className="text-sm font-medium text-white">{request.requester.name}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-400/10 text-yellow-500'
                          : request.status === 'accepted'
                          ? 'bg-green-400/10 text-green-500'
                          : 'bg-red-400/10 text-red-500'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-dark-300">{request.message}</p>

                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <span className="text-sm text-dark-300">Dates</span>
                        <p className="mt-1 text-sm font-medium text-white">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-dark-300">Amount</span>
                        <p className="mt-1 text-sm font-medium text-white">
                          ${request.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-dark-300">Requested</span>
                        <p className="mt-1 text-sm font-medium text-white">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="mt-6 flex items-center gap-4">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300"
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request._id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-dark-300 bg-dark-700/50 rounded-lg hover:bg-dark-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-dark-700 transition-all duration-300"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 