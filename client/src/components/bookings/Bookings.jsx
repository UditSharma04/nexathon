import DashboardLayout from '../dashboard/DashboardLayout';

export default function Bookings() {
  // Mock data - replace with API call
  const bookings = [
    {
      id: 1,
      item: {
        name: 'Mountain Bike',
        image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
      },
      owner: 'Sarah Wilson',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      totalPrice: 125,
      location: '123 Main St, City',
    },
    {
      id: 2,
      item: {
        name: 'DSLR Camera',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      },
      owner: 'John Doe',
      status: 'pending',
      startDate: '2024-03-22',
      endDate: '2024-03-25',
      totalPrice: 105,
      location: '456 Oak St, City',
    },
    {
      id: 3,
      item: {
        name: 'Camping Tent',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
      },
      owner: 'Emma Davis',
      status: 'completed',
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      totalPrice: 45,
      location: '789 Pine St, City',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-red-500/10 text-red-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
            <p className="mt-1 text-sm text-dark-300">
              Manage your current and upcoming bookings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
          <ul className="divide-y divide-dark-700/50">
            {bookings.map((booking) => (
              <li key={booking.id} className="group hover:bg-dark-800/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      src={booking.item.image}
                      alt={booking.item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                          {booking.item.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-dark-300">From {booking.owner}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-dark-400 text-sm">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.startDate} - {booking.endDate}
                        </div>
                        <div className="flex items-center text-dark-400 text-sm">
                          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.location}
                        </div>
                        <div className="text-lg font-medium text-primary-400">
                          ${booking.totalPrice}
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
} 