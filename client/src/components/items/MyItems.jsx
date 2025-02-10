import { useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import AddItemModal from './AddItemModal';

export default function MyItems() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock data - replace with API call
  const myItems = [
    {
      id: 1,
      name: 'Power Drill',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
      status: 'borrowed',
      borrower: {
        name: 'Sarah Wilson',
        rating: 4.8,
        returnDate: '2024-03-20'
      },
      totalEarnings: 45,
      totalBookings: 3
    },
    {
      id: 2,
      name: 'Mountain Bike',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91',
      status: 'available',
      totalEarnings: 120,
      totalBookings: 5
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Items</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myItems.map((item) => (
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">{item.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-dark-400">Total Earnings</p>
                    <p className="mt-1 text-lg font-medium text-primary-400">
                      ${item.totalEarnings}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-400">Total Bookings</p>
                    <p className="mt-1 text-lg font-medium text-white">
                      {item.totalBookings}
                    </p>
                  </div>
                </div>

                {item.status === 'borrowed' && item.borrower && (
                  <div className="mt-4 pt-4 border-t border-dark-700/50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-400">
                          {item.borrower.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          Borrowed by {item.borrower.name}
                        </p>
                        <p className="text-xs text-dark-400">
                          Return date: {item.borrower.returnDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </DashboardLayout>
  );
} 