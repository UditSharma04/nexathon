export default function ItemGrid({ view, filters }) {
  const items = [
    {
      id: 1,
      name: 'Mountain Bike',
      category: 'sports',
      status: 'available',
      description: 'High-quality mountain bike, perfect for weekend adventures.',
      price: 25,
      period: 'day',
      rating: 4.8,
      totalBookings: 12,
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    },
    {
      id: 2,
      name: 'DSLR Camera',
      category: 'electronics',
      status: 'borrowed',
      description: 'Professional DSLR camera with multiple lenses.',
      price: 35,
      period: 'day',
      rating: 4.9,
      totalBookings: 8,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    },
    // Add more items as needed
  ];

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-500/10 text-green-400'
                      : item.status === 'borrowed'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-dark-300">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-primary-400">
                      ${item.price}
                    </span>
                    <span className="text-sm text-dark-400 ml-1">
                      /{item.period}
                    </span>
                  </div>
                  <div className="flex items-center text-dark-400">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm">{item.rating}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{item.totalBookings} bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
      <ul className="divide-y divide-dark-700/50">
        {items.map((item) => (
          <li key={item.id} className="group hover:bg-dark-800/50 transition-colors">
            <div className="flex items-center p-6">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-500/10 text-green-400'
                      : item.status === 'borrowed'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-dark-300">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-primary-400">
                      ${item.price}
                    </span>
                    <span className="text-sm text-dark-400 ml-1">
                      /{item.period}
                    </span>
                  </div>
                  <div className="flex items-center text-dark-400">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm">{item.rating}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{item.totalBookings} bookings</span>
                  </div>
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
  );
} 