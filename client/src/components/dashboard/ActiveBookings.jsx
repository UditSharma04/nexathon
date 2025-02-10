export default function ActiveBookings() {
  const bookings = [
    {
      id: 1,
      item: 'Mountain Bike',
      owner: 'Sarah Wilson',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    },
    {
      id: 2,
      item: 'DSLR Camera',
      owner: 'John Doe',
      status: 'pending',
      startDate: '2024-03-22',
      endDate: '2024-03-25',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    },
  ];

  return (
    <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white">Active Bookings</h2>
        <p className="mt-1 text-sm text-dark-300">Your current and upcoming bookings</p>
      </div>
      <div className="border-t border-dark-700/50">
        <ul className="divide-y divide-dark-700/50">
          {bookings.map((booking) => (
            <li key={booking.id} className="group hover:bg-dark-800/50 transition-colors">
              <div className="flex items-center p-6">
                <img
                  src={booking.image}
                  alt={booking.item}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                      {booking.item}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'active'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dark-300">From {booking.owner}</p>
                  <div className="mt-2 flex items-center text-sm text-dark-400">
                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {booking.startDate} - {booking.endDate}
                  </div>
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
      <div className="border-t border-dark-700/50 p-4">
        <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-dark-300 hover:text-white rounded-xl hover:bg-dark-700/50 transition-colors">
          View all bookings
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
} 