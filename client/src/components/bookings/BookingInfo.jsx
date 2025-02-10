import { useState, useEffect } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { bookingsAPI } from '../../services/api';

export default function BookingInfo() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await bookingsAPI.getMyRequests();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-500';
      case 'accepted':
        return 'bg-green-400/10 text-green-500';
      case 'declined':
        return 'bg-red-400/10 text-red-500';
      case 'cancelled':
        return 'bg-gray-400/10 text-gray-500';
      default:
        return 'bg-blue-400/10 text-blue-500';
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const calculateBill = (booking) => {
    const startDateTime = new Date(booking.startDate);
    const endDateTime = new Date(booking.endDate);
    
    let duration;
    let basePrice;
    
    if (booking.period === 'hour') {
      // Calculate total hours
      const diffInMilliseconds = endDateTime - startDateTime;
      const totalHours = diffInMilliseconds / (1000 * 60 * 60);
      const roundedHours = Math.ceil(totalHours); // Round up to nearest hour
      
      duration = {
        hours: roundedHours,
        formatted: `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`
      };
      
      // Calculate base price for hourly rate
      basePrice = booking.item.price * roundedHours;
    } else {
      // Calculate days for daily/weekly rentals
      const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
      duration = {
        days,
        formatted: `${days} day${days !== 1 ? 's' : ''}`
      };
      basePrice = booking.item.price * days;
    }
    
    // Get insurance value from the item
    const insuranceValue = booking.item.insurance || 0;
    
    // Calculate commission (2% of base price only)
    const commission = basePrice * 0.02;
    
    // Calculate total
    const totalAmount = basePrice + insuranceValue + commission;

    return {
      duration,
      basePrice,
      insuranceAmount: insuranceValue,
      commission,
      totalAmount,
      breakdown: {
        rate: booking.item.price,
        period: booking.period,
        insuranceValue,
        commissionRate: '2%'
      }
    };
  };

  const handleGenerateBill = (booking) => {
    setSelectedBooking(booking);
    setShowBillModal(true);
  };

  const handlePayment = async (booking, bill) => {
    try {
      // Here you would integrate with your payment provider
      // For now, let's just log the payment details
      console.log('Processing payment:', {
        bookingId: booking._id,
        amount: bill.totalAmount,
        breakdown: bill
      });

      // Close the modal after successful payment
      setShowBillModal(false);
      setSelectedBooking(null);

      // Optionally refresh the bookings list
      fetchMyBookings();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment');
    }
  };

  const BillModal = ({ booking, onClose }) => {
    const bill = calculateBill(booking);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={onClose} />
          
          <div className="inline-block align-bottom bg-dark-800/50 backdrop-blur-xl rounded-xl border border-dark-700/50 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Booking Bill
                </h3>
                
                <div className="mt-4 space-y-4">
                  {/* Item and Duration Info */}
                  <div className="bg-dark-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-300">Item</span>
                      <span className="text-white font-medium">{booking.item.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-dark-300">Duration</span>
                      <span className="text-white font-medium">{bill.duration.formatted}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-dark-300">Rate</span>
                      <span className="text-white font-medium">
                        ${bill.breakdown.rate.toFixed(2)}/{bill.breakdown.period}
                      </span>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-300">
                        Base Price ({bill.duration.formatted} × ${bill.breakdown.rate.toFixed(2)})
                      </span>
                      <span className="text-white">${bill.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-300">Insurance Value</span>
                      <span className="text-white">${bill.insuranceAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-300">Platform Fee (2% of base price)</span>
                      <span className="text-white">${bill.commission.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dark-700/50 pt-2 mt-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-dark-300">Total Amount</span>
                        <span className="text-white">${bill.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-dark-300 bg-dark-700/50 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePayment(booking, bill)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingActions = (booking) => {
    if (booking.status === 'accepted') {
      return (
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => handleGenerateBill(booking)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300"
          >
            Generate Bill & Pay
          </button>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading bookings...</div>
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
              <h1 className="text-2xl font-bold text-white">My Bookings</h1>
              <p className="text-dark-400 mt-1">View and manage your booking requests</p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-900 border border-dark-700/50 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
            >
              <option value="all" className="bg-dark-900 text-white">All Status</option>
              <option value="pending" className="bg-dark-900 text-white">Pending</option>
              <option value="accepted" className="bg-dark-900 text-white">Accepted</option>
              <option value="declined" className="bg-dark-900 text-white">Declined</option>
              <option value="cancelled" className="bg-dark-900 text-white">Cancelled</option>
            </select>
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

          {/* No Bookings Message */}
          {filteredBookings.length === 0 && !error && (
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
                <p className="text-dark-400">This booking request doesn't exist or has been removed</p>
              </div>
            </div>
          )}

          {/* Bookings List */}
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6"
              >
                <div className="relative">
                  <div className="flex items-start gap-6">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-dark-900/50">
                      {booking.item?.images?.[0] ? (
                        <img
                          src={booking.item.images[0]}
                          alt={booking.item.name}
                          className="w-full h-full object-contain bg-dark-900"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-900">
                          <svg className="w-8 h-8 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {booking.item.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-dark-400">Owner:</span>
                            <span className="text-sm font-medium text-white">{booking.owner.name}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-dark-400">{booking.message}</p>

                      <div className="mt-4 grid grid-cols-3 gap-6">
                        <div>
                          <span className="text-sm text-dark-400">Dates</span>
                          <p className="mt-1 text-sm font-medium text-white">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-dark-400">Amount</span>
                          <p className="mt-1 text-sm font-medium text-white">
                            ${booking.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-dark-400">Requested On</span>
                          <p className="mt-1 text-sm font-medium text-white">
                            {new Date(booking.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {booking.status === 'accepted' && renderBookingActions(booking)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBillModal && selectedBooking && (
        <BillModal
          booking={selectedBooking}
          onClose={() => {
            setShowBillModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </DashboardLayout>
  );
} 