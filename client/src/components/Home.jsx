import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './dashboard/DashboardLayout';
import { useEffect, useState } from 'react';
import { bookingsAPI, itemsAPI } from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [stats, setStats] = useState({
    itemsShared: 0,
    moneySaved: 0,
    moneyEarned: 0,
    co2Reduced: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch borrowed items (accepted booking requests)
        const myRequestsResponse = await bookingsAPI.getMyRequests();
        const activeBorrowedItems = myRequestsResponse.data.filter(
          request => request.status === 'accepted' && new Date(request.endDate) >= new Date()
        );
        setBorrowedItems(activeBorrowedItems);

        // Fetch data for stats
        const [myItems, myRequests, incomingRequests] = await Promise.all([
          itemsAPI.getMyItems(),
          bookingsAPI.getMyRequests(),
          bookingsAPI.getIncomingRequests()
        ]);

        // Calculate stats
        const userStats = {
          // Items shared = number of items user has listed
          itemsShared: myItems.data.length,
          
          // Money saved = total amount saved from borrowing items
          moneySaved: myRequests.data
            .filter(req => req.status === 'accepted')
            .reduce((total, req) => total + req.totalAmount, 0),
          
          // Money earned = total amount earned from lending items
          moneyEarned: incomingRequests.data
            .filter(req => req.status === 'accepted')
            .reduce((total, req) => total + req.totalAmount, 0),
          
          // CO2 reduced = 1kg per day of borrowing (rough estimation)
          co2Reduced: myRequests.data
            .filter(req => req.status === 'accepted')
            .reduce((total, req) => {
              const days = Math.ceil(
                (new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)
              );
              return total + days;
            }, 0),
          
          // Rating = average of ratings received as an owner
          rating: calculateAverageRating(incomingRequests.data)
        };
        setStats(userStats);

        // Fetch recent activity (combine booking requests and returns)
        const allActivity = [...incomingRequests.data, ...myRequests.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(activity => ({
            id: activity._id,
            type: activity.status === 'accepted' ? 'item_returned' : 'booking_request',
            item: activity.item.name,
            user: activity.requester.name,
            time: formatTimeAgo(new Date(activity.createdAt))
          }));
        setRecentActivity(allActivity);

        // Fetch nearby items
        const itemsResponse = await itemsAPI.getAllItems();
        const nearbyItemsList = itemsResponse.data
          .filter(item => !item.isBooked)
          .slice(0, 4)
          .map(item => ({
            id: item._id,
            name: item.name,
            image: item.images[0],
            price: item.price,
            distance: calculateDistance(item.location) // You can implement this based on user's location
          }));
        setNearbyItems(nearbyItemsList);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load home data. Please try again later.');
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [user]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'just now';
  };

  const calculateDistance = (location) => {
    // Implement distance calculation based on user's location
    // For now, return a random distance between 0.1 and 5 km
    return (Math.random() * 4.9 + 0.1).toFixed(1);
  };

  const calculateAverageRating = (bookings) => {
    const completedBookings = bookings.filter(booking => booking.status === 'accepted' && booking.rating);
    if (completedBookings.length === 0) return 0;
    const totalRating = completedBookings.reduce((sum, booking) => sum + booking.rating, 0);
    return (totalRating / completedBookings.length).toFixed(1);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-dark-400 animate-pulse">Loading your dashboard...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-xl p-4 text-red-400">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Greeting */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
          <h1 className="text-3xl font-bold text-white">
            Good {getTimeOfDay()}, {user?.name || 'there'}! 👋
          </h1>
          <p className="mt-2 text-dark-300">
            Welcome back to ShareHub. What would you like to do today?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
            <p className="text-dark-300">My Items</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stats.itemsShared}</p>
          </div>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
            <p className="text-dark-300">Money Saved</p>
            <p className="mt-1 text-2xl font-semibold text-white">${stats.moneySaved.toFixed(2)}</p>
            <p className="text-xs text-dark-400 mt-1">From borrowing items</p>
          </div>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
            <p className="text-dark-300">Money Earned</p>
            <p className="mt-1 text-2xl font-semibold text-white">${stats.moneyEarned.toFixed(2)}</p>
            <p className="text-xs text-dark-400 mt-1">From lending items</p>
          </div>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
            <p className="text-dark-300">CO₂ Reduced</p>
            <div className="flex items-center gap-1">
              <p className="mt-1 text-2xl font-semibold text-white">{stats.co2Reduced}</p>
              <span className="text-sm text-green-400 mt-2">kg</span>
            </div>
            <p className="text-xs text-dark-400 mt-1">By sharing instead of buying</p>
          </div>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4">
            <p className="text-dark-300">My Rating</p>
            <div className="flex items-center gap-1">
              <p className="mt-1 text-2xl font-semibold text-white">{stats.rating}</p>
              {stats.rating > 0 && (
                <svg className="w-6 h-6 text-yellow-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
            <p className="text-xs text-dark-400 mt-1">Based on {stats.rating > 0 ? 'lender ratings' : 'no ratings yet'}</p>
          </div>
        </div>

        {borrowedItems.length > 0 ? (
          /* Currently Borrowed Items */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Currently Borrowed</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {borrowedItems.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    {booking.item?.images?.[0] ? (
                      <img
                        src={booking.item.images[0]}
                        alt={booking.item.name}
                        className="w-full h-48 object-contain bg-dark-900"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-dark-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white">{booking.item.name}</h3>
                    <div className="mt-2 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-400">
                          {booking.owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm text-dark-300">
                          Borrowed from {booking.owner.name}
                        </p>
                        <p className="text-sm font-medium text-yellow-400">
                          {Math.ceil((new Date(booking.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left to return
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Quick Actions */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              to="/browse"
              className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">
                Browse Items
              </h3>
              <p className="mt-2 text-dark-300">
                Discover items available for borrowing in your area
              </p>
            </Link>

            <Link
              to="/my-items"
              className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">
                Add Item
              </h3>
              <p className="mt-2 text-dark-300">
                Share your items with others and earn while helping the community
              </p>
            </Link>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
            {recentActivity.length > 0 ? (
              <ul className="divide-y divide-dark-700/50">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                        {activity.type === 'booking_request' ? (
                          <svg className="h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-white">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.type === 'booking_request' ? 'requested to borrow' : 'returned'}{' '}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <p className="text-sm text-dark-300">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-dark-300">No recent activity</div>
            )}
          </div>
        </div>

        {/* Nearby Items */}
        {nearbyItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Nearby Items</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {nearbyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-contain bg-dark-900"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-dark-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-dark-300">{item.distance} miles away</span>
                      <span className="font-medium text-primary-400">${item.price}/day</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}