import { Link } from 'react-router-dom';

export default function ItemGrid({ view, filters }) {
  const items = [
    {
      id: 1,
      name: 'Power Drill',
      category: 'tools',
      status: 'available',
      description: 'Professional-grade power drill, perfect for home projects. Includes multiple drill bits.',
      price: 15,
      period: 'day',
      rating: 4.8,
      totalBookings: 12,
      distance: 2,
      impact: {
        moneySaved: 85,
        co2Reduced: 2.5
      },
      owner: {
        name: 'John D.',
        rating: 4.9,
        verified: true
      },
      insurance: 200,
      condition: 'Like New',
      nextAvailable: '2024-03-15',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
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
      distance: 3.5,
      impact: {
        moneySaved: 120,
        co2Reduced: 3.2
      },
      owner: {
        name: 'Sarah W.',
        rating: 4.8,
        verified: true
      },
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    },
    {
      id: 3,
      name: 'Camping Tent',
      category: 'camping',
      status: 'available',
      description: '4-person camping tent, waterproof and easy to set up.',
      price: 25,
      period: 'day',
      rating: 4.7,
      totalBookings: 15,
      distance: 1.8,
      impact: {
        moneySaved: 95,
        co2Reduced: 2.8
      },
      owner: {
        name: 'Mike R.',
        rating: 4.7,
        verified: false
      },
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
    }
  ];

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="relative group bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
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
                
                <div className="mt-1 flex items-center text-dark-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="ml-1 text-sm">{item.distance} miles away</span>
                </div>

                <p className="mt-2 text-sm text-dark-300 line-clamp-2">{item.description}</p>

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
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm">{item.rating}</span>
                    </div>
                    {item.impact && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="ml-1 text-sm">${item.impact.moneySaved} saved</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-700/50">
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-400">
                          {item.owner.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-white">
                          {item.owner.name}
                          {item.owner.verified && (
                            <svg className="ml-1 h-4 w-4 text-blue-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </p>
                        {item.nextAvailable && (
                          <p className="text-xs text-dark-400">
                            Next available: {item.nextAvailable}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
      <ul className="divide-y divide-dark-700/50">
        {items.map((item) => (
          <li key={item.id} className="group hover:bg-dark-800/50 transition-colors">
            <Link to={`/items/${item.id}`} className="block">
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
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dark-300">{item.description}</p>
                  <div className="mt-2 flex items-center text-dark-400">
                    <span className="text-lg font-medium text-primary-400">${item.price}</span>
                    <span className="text-sm ml-1">/{item.period}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{item.distance} miles away</span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 