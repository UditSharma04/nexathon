import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './dashboard/DashboardLayout';

export default function Home() {
  const { user } = useAuth();

  // Mock data - replace with API call
  const borrowedItems = [
    {
      id: 1,
      name: 'Power Drill',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
      owner: {
        name: 'John D.',
        rating: 4.9
      },
      dueDate: '2024-03-20',
      daysLeft: 5
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'booking_request',
      item: 'Mountain Bike',
      user: 'Mike R.',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'item_returned',
      item: 'Camera Lens',
      user: 'Sarah W.',
      time: '1 day ago'
    }
  ];

  const nearbyItems = [
    {
      id: 1,
      name: 'Electric Guitar',
      image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02',
      distance: 0.5,
      price: 25
    },
    {
      id: 2,
      name: 'Camping Tent',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
      distance: 1.2,
      price: 30
    }
  ];

  const stats = [
    { label: 'Items Shared', value: '12' },
    { label: 'Money Saved', value: '$345' },
    { label: 'CO₂ Reduced', value: '28kg' },
    { label: 'Community Rating', value: '4.9' }
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-4"
            >
              <p className="text-dark-300">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {borrowedItems.length > 0 ? (
          /* Currently Borrowed Items */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Currently Borrowed</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {borrowedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white">{item.name}</h3>
                    <div className="mt-2 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-400">
                          {item.owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm text-dark-300">
                          Borrowed from {item.owner.name}
                        </p>
                        <p className="text-sm font-medium text-yellow-400">
                          {item.daysLeft} days left to return
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
              to="/items"
              className="group relative bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                  Browse Items
                </h3>
                <p className="mt-2 text-dark-300">
                  Discover items available for borrowing in your area
                </p>
              </div>
            </Link>

            <Link
              to="/my-items"
              className="group relative bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                  Add Item
                </h3>
                <p className="mt-2 text-dark-300">
                  Share your items with others and earn while helping the community
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
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
                        <span className="font-medium">{activity.user}</span>
                        {activity.type === 'booking_request' ? ' requested to borrow ' : ' returned '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-dark-400">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nearby Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Nearby Items</h2>
            <Link to="/items" className="text-sm text-primary-400 hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nearbyItems.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 