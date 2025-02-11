import { useState, useEffect } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import ReviewForm from '../reviews/ReviewForm';
import { useAuth } from '../../context/AuthContext';
import { reviewAPI } from '../../services/api';
import PaymentModal from '../payments/PaymentModal';
import { itemsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const ReturnButton = ({ booking, onReturn, isRequester = false }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleReturn = async () => {
    try {
      setLoading(true);
      // Pass the user role (requester or owner) in the request
      await bookingsAPI.updateRequestStatus(booking._id, 'returned', {
        isRequester,
        returnConfirmation: {
          [isRequester ? 'requester' : 'owner']: true
        }
      });
      onReturn(); // Refresh the bookings list
    } catch (error) {
      console.error('Error marking as returned:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has already confirmed return
  const hasConfirmed = isRequester 
    ? booking.returnConfirmation?.requester 
    : booking.returnConfirmation?.owner;

  // Don't show button if not in borrowed status or already confirmed
  if (booking.status !== 'borrowed' || hasConfirmed) return null;

  return (
    <button
      onClick={handleReturn}
      disabled={loading || hasConfirmed}
      className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg hover:from-green-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-green-500 disabled:opacity-50"
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      Confirm Return
    </button>
  );
};

export const ReturnStatus = ({ booking }) => {
  const { user } = useAuth();
  const isRequester = booking.requester._id === user.id;

  if (booking.status !== 'borrowed' || !booking.returnConfirmation) return null;

  const getStatusMessage = () => {
    const userType = isRequester ? 'requester' : 'owner';
    const hasConfirmed = isRequester 
      ? booking.returnConfirmation.requester 
      : booking.returnConfirmation.owner;
    
    if (hasConfirmed) {
      return "Waiting for other party to confirm return";
    }
    return "Please confirm the return if the item has been returned";
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm text-dark-400">Return confirmation status:</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-300">Owner:</span>
          {booking.returnConfirmation.owner ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-500">
              Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-500">
              Pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-300">Borrower:</span>
          {booking.returnConfirmation.requester ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-500">
              Confirmed
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-500">
              Pending
            </span>
          )}
        </div>
      </div>
      <div className="text-sm text-dark-400 mt-2">
        {getStatusMessage()}
      </div>
    </div>
  );
};

// Move ReviewButtons outside of BookingInfo component
const ReviewButtons = ({ booking, onReviewSubmit }) => {
  const { user } = useAuth();
  const [showUserReviewForm, setShowUserReviewForm] = useState(false);
  const [showItemReviewForm, setShowItemReviewForm] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem(`reviews-${booking._id}`);
    return stored ? JSON.parse(stored) : {
      user: false,
      item: false
    };
  });

  // Add checks for undefined values
  if (!booking || !user || !booking.owner || !booking.requester) {
    return null;
  }

  const isOwner = booking.owner._id === user.id;
  const isRequester = booking.requester._id === user.id;

  // Check if reviews already exist in the booking or local storage
  const hasUserReview = booking.userReview || submittedReviews.user;
  const hasItemReview = booking.itemReview || submittedReviews.item;

  // Show review buttons for completed status
  if (booking.status !== 'completed') return null;

  const handleReviewSubmit = async (reviewData) => {
    try {
      await onReviewSubmit(reviewData);
      
      // Update local state and localStorage
      const newSubmittedReviews = {
        ...submittedReviews,
        [reviewData.reviewType]: true
      };
      
      setSubmittedReviews(newSubmittedReviews);
      localStorage.setItem(`reviews-${booking._id}`, JSON.stringify(newSubmittedReviews));
      
      // Close the form
      if (reviewData.reviewType === 'user') {
        setShowUserReviewForm(false);
      } else {
        setShowItemReviewForm(false);
      }
      
      // Show success message
      toast.success(`${reviewData.reviewType === 'user' ? 'User' : 'Item'} review submitted successfully!`, {
        style: {
          background: '#1F2937',
          color: '#fff',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      });
    } catch (error) {
      toast.error('Failed to submit review. Please try again.', {
        style: {
          background: '#1F2937',
          color: '#fff',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      });
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {/* User Review Button */}
      {!hasUserReview && (
        <button
          onClick={() => setShowUserReviewForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Review {isOwner ? 'Borrower' : 'Owner'}
        </button>
      )}

      {/* Item Review Button */}
      {isRequester && !hasItemReview && booking.item && (
        <button
          onClick={() => setShowItemReviewForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Review Item
        </button>
      )}

      {showUserReviewForm && (
        <ReviewForm
          booking={booking}
          reviewType="user"
          reviewedUser={isOwner ? booking.requester : booking.owner}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowUserReviewForm(false)}
        />
      )}

      {showItemReviewForm && (
        <ReviewForm
          booking={booking}
          reviewType="item"
          reviewedItem={booking.item}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowItemReviewForm(false)}
        />
      )}
    </div>
  );
};

export default function BookingInfo() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await bookingsAPI.getMyRequests();
      console.log('Bookings data:', response.data); // Debug log
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
      case 'borrowed':
        return 'bg-blue-400/10 text-blue-500';
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

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewAPI.createReview(reviewData);
      fetchMyBookings(); // Refresh the bookings list
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const renderBookingActions = (booking) => {
    if (booking.status === 'accepted') {
      return (
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedBooking(booking);
              setShowBillModal(true);
            }}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pay Now
          </button>
        </div>
      );
    }

    if (booking.status === 'borrowed') {
      const { user } = useAuth();
      const isRequester = booking.requester._id === user.id;

      return (
        <div className="mt-6 flex flex-col gap-4">
          <ReturnButton 
            booking={booking} 
            onReturn={fetchMyBookings} 
            isRequester={isRequester} 
          />
          <ReturnStatus booking={booking} />
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
              <option value="borrowed" className="bg-dark-900 text-white">Borrowed</option>
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

                      <div className="mt-4">
                        {renderBookingActions(booking)}
                      </div>

                      <ReviewButtons booking={booking} onReviewSubmit={handleReviewSubmit} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBillModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          bill={calculateBill(selectedBooking)}
          onSuccess={async (paymentDetails) => {
            try {
              // Update booking status with payment details
              const response = await bookingsAPI.updateBookingStatus(selectedBooking._id, {
                status: 'borrowed',
                paymentDetails: {
                  paymentId: paymentDetails.paymentId,
                  amount: paymentDetails.amount,
                  method: paymentDetails.method,
                  timestamp: paymentDetails.timestamp
                },
                paymentStatus: 'paid'
              });

              // Update UI with the response data
              setBookings(prevBookings => 
                prevBookings.map(booking => 
                  booking._id === selectedBooking._id
                    ? response.data
                    : booking
                )
              );
              
              // Show success message
              console.log('Payment successful:', paymentDetails);
            } catch (error) {
              console.error('Error updating booking:', error);
              setError('Failed to update booking status');
            } finally {
              setShowBillModal(false);
              setSelectedBooking(null);
            }
          }}
          onClose={() => {
            setShowBillModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </DashboardLayout>
  );
} 