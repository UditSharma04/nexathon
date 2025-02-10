import { useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import ItemGrid from './ItemGrid';
import AddItemModal from './AddItemModal';

export default function Items() {
  const [view, setView] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    maxDistance: '',
    availability: '',
    priceRange: '',
  });

  const categories = [
    { id: 'tools', name: 'Tools' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'camping', name: 'Camping Gear' },
    { id: 'sports', name: 'Sports Equipment' },
    { id: 'kitchen', name: 'Kitchen Appliances' },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Browse Items</h1>
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

        {/* Filters */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="search" className="sr-only">Search items</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-3 py-2 border border-dark-700/50 rounded-xl bg-dark-900/50 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search items..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="sr-only">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-dark-700/50 rounded-xl bg-dark-900/50 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maxDistance" className="sr-only">Max Distance</label>
              <select
                id="maxDistance"
                name="maxDistance"
                value={filters.maxDistance}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-dark-700/50 rounded-xl bg-dark-900/50 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Any Distance</option>
                <option value="1">Within 1 mile</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="20">Within 20 miles</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability" className="sr-only">Availability</label>
              <select
                id="availability"
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-dark-700/50 rounded-xl bg-dark-900/50 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Any Status</option>
                <option value="available">Available Now</option>
                <option value="upcoming">Available Soon</option>
              </select>
            </div>

            <div>
              <label htmlFor="priceRange" className="sr-only">Price Range</label>
              <select
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-dark-700/50 rounded-xl bg-dark-900/50 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Any Price</option>
                <option value="0-10">Under $10</option>
                <option value="10-25">$10 - $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50+">Over $50</option>
              </select>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'grid'
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
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
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Items Grid/List */}
        <ItemGrid view={view} filters={filters} />

        {/* Add Item Modal */}
        <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </DashboardLayout>
  );
} 