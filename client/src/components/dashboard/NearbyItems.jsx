export default function NearbyItems() {
  const items = [
    {
      id: 1,
      name: 'Electric Drill',
      owner: 'Mike Johnson',
      distance: '0.8',
      price: '5',
      period: 'day',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJpbGx8ZW58MHx8MHx8&w=1000&q=80',
    },
    {
      id: 2,
      name: 'Camping Tent',
      owner: 'Emma Davis',
      distance: '1.2',
      price: '15',
      period: 'day',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGluZyUyMHRlbnR8ZW58MHx8MHx8&w=1000&q=80',
    },
    {
      id: 3,
      name: 'Stand Mixer',
      owner: 'Lisa Anderson',
      distance: '1.5',
      price: '10',
      period: 'day',
      image: 'https://images.unsplash.com/photo-1594228113580-c91a6c162cb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhbmQlMjBtaXhlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
    },
  ];

  return (
    <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Nearby Items</h2>
            <p className="mt-1 text-sm text-dark-300">Available items in your area</p>
          </div>
          <button className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="border-t border-dark-700/50">
        <ul className="divide-y divide-dark-700/50">
          {items.map((item) => (
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
                    <span className="inline-flex items-center text-sm text-dark-400">
                      <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.distance} miles away
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-dark-300">From {item.owner}</p>
                  <div className="mt-2 flex items-center text-sm font-medium text-primary-400">
                    ${item.price}/{item.period}
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
          View all nearby items
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
} 