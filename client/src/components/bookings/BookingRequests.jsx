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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Booking Requests</h1>
              <p className="text-dark-400 mt-1">Review and manage incoming booking requests</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-xl p-4 text-red-400">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* No Requests Message */}
          {requests.length === 0 && !error && (
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No booking requests</h3>
                <p className="text-dark-400">You don't have any booking requests yet</p>
              </div>
            </div>
          )}

          {/* Requests List */}
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Item Image */}
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden bg-dark-900/50 flex-shrink-0">
                      {request.item?.images?.[0] ? (
                        <img
                          src={request.item.images[0]}
                          alt={request.item.name}
                          className="absolute inset-0 w-full h-full object-contain bg-dark-900"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
                          <svg className="w-8 h-8 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-medium text-white truncate">
                            {request.item.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-dark-400">Requested by</span>
                            <span className="text-sm font-medium text-white">{request.requester.name}</span>
                          </div>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : request.status === 'accepted'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-dark-400">{request.message}</p>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-3 border border-dark-700/50">
                          <span className="text-sm text-dark-400">Dates</span>
                          <p className="mt-1 text-sm font-medium text-white">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-3 border border-dark-700/50">
                          <span className="text-sm text-dark-400">Amount</span>
                          <p className="mt-1 text-lg font-medium text-primary-400">
                            ${request.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-dark-800/30 backdrop-blur-sm rounded-lg p-3 border border-dark-700/50">
                          <span className="text-sm text-dark-400">Requested on</span>
                          <p className="mt-1 text-sm font-medium text-white">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request._id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500/20 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
      </div>
    </DashboardLayout>
  );
}