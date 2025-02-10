import DashboardLayout from '../dashboard/DashboardLayout';

export default function Profile() {
  // Mock data - replace with API call
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    memberSince: 'January 2024',
    rating: 4.9,
    totalItems: 8,
    totalBookings: 15,
    totalEarnings: 1423,
    avatar: null,
    items: [
      {
        id: 1,
        name: 'Mountain Bike',
        status: 'available',
        totalBookings: 12,
        image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
      },
      {
        id: 2,
        name: 'DSLR Camera',
        status: 'borrowed',
        totalBookings: 8,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-8">
          <div className="flex items-center">
            <div className="h-24 w-24 rounded-full bg-primary-500/10 flex items-center justify-center">
              <span className="text-3xl font-medium text-primary-400">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <div className="mt-1 flex items-center text-dark-400">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{user.rating}</span>
                <span className="mx-2">•</span>
                <span>Member since {user.memberSince}</span>
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <dt className="text-sm font-medium text-dark-300">Total Items</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">{user.totalItems}</dd>
            </div>
          </div>
          <div className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <dt className="text-sm font-medium text-dark-300">Total Bookings</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">{user.totalBookings}</dd>
            </div>
          </div>
          <div className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <dt className="text-sm font-medium text-dark-300">Total Earnings</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">${user.totalEarnings}</dd>
            </div>
          </div>
          <div className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <dt className="text-sm font-medium text-dark-300">Rating</dt>
              <dd className="mt-2 flex items-baseline">
                <span className="text-2xl font-semibold text-white">{user.rating}</span>
                <span className="ml-2 text-sm text-dark-400">/ 5.0</span>
              </dd>
            </div>
          </div>
        </div>

        {/* My Items */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">My Items</h2>
              <button className="text-dark-400 hover:text-white transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="border-t border-dark-700/50">
            <ul className="divide-y divide-dark-700/50">
              {user.items.map((item) => (
                <li key={item.id} className="group hover:bg-dark-800/50 transition-colors">
                  <div className="flex items-center p-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                          {item.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'available'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-dark-300">{item.totalBookings} bookings</p>
                    </div>
                    <button className="ml-4 p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 