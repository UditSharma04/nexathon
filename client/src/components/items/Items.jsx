import { useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import ItemGrid from './ItemGrid';
import ItemFilters from './ItemFilters';
import AddItemModal from './AddItemModal';

export default function Items() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Items</h1>
            <p className="mt-1 text-sm text-dark-300">
              Manage your shared items and track their status
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Item
          </button>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between">
          <ItemFilters filters={filters} setFilters={setFilters} />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid'
                  ? 'text-primary-400 bg-primary-500/10'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'text-primary-400 bg-primary-500/10'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <ItemGrid view={view} filters={filters} />

        {/* Add Item Modal */}
        <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </DashboardLayout>
  );
} 