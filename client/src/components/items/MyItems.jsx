import { useState, useEffect } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import AddItemModal from './AddItemModal';
import { itemsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { processImage } from '../../utils/imageUtils';

// Constants for view types
const VIEW_TYPES = {
  GRID: 'grid',
  TABLE: 'table'
};

// Filter options
const FILTER_OPTIONS = {
  STATUS: [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'borrowed', label: 'Borrowed' },
    { value: 'maintenance', label: 'Maintenance' }
  ],
  CATEGORY: [
    { value: 'all', label: 'All Categories' },
    { value: 'tools', label: 'Tools' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'sports', label: 'Sports' },
    { value: 'camping', label: 'Camping' },
    { value: 'party', label: 'Party' }
  ],
  SORT: [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' }
  ]
};

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [processedImages, setProcessedImages] = useState({});
  
  // New states for filtering and view
  const [viewType, setViewType] = useState(VIEW_TYPES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchItems = async () => {
    try {
      const response = await itemsAPI.getMyItems();
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const processImages = async () => {
      const processed = {};
      for (const item of items) {
        if (item.images[0] && !processedImages[item.images[0]]) {
          processed[item.images[0]] = await processImage(item.images[0]);
        }
      }
      setProcessedImages(prev => ({ ...prev, ...processed }));
    };

    if (items.length > 0) {
      processImages();
    }
  }, [items]);

  const handleItemAdded = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // First, add a clearFilters function
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">My Items</h1>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="bg-dark-800/30 backdrop-blur-xl rounded-lg border border-dark-700/50 p-1">
              <button
                onClick={() => setViewType(VIEW_TYPES.GRID)}
                className={`p-2 rounded-md transition-colors ${
                  viewType === VIEW_TYPES.GRID
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewType(VIEW_TYPES.TABLE)}
                className={`p-2 rounded-md transition-colors ${
                  viewType === VIEW_TYPES.TABLE
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            
          <button
            onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Item
          </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-12 gap-4">
          {/* Search - wider */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full px-4 py-2 bg-dark-800/30 backdrop-blur-xl rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 top-2.5 text-dark-400 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters - shorter and grouped */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-dark-800/30 backdrop-blur-xl rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer text-sm"
                  style={{ 
                    WebkitAppearance: 'none',
                    MozAppearance: 'none' 
                  }}
                >
                  {FILTER_OPTIONS.STATUS.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-dark-800 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-dark-800/30 backdrop-blur-xl rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer text-sm"
                  style={{ 
                    WebkitAppearance: 'none',
                    MozAppearance: 'none' 
                  }}
                >
                  {FILTER_OPTIONS.CATEGORY.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-dark-800 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Sort By */}
              <div className="relative flex-1 min-w-[140px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-1.5 bg-dark-800/30 backdrop-blur-xl rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer text-sm"
                  style={{ 
                    WebkitAppearance: 'none',
                    MozAppearance: 'none' 
                  }}
                >
                  {FILTER_OPTIONS.SORT.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-dark-800 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-dark-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="col-span-12 lg:col-span-1 flex items-start">
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-dark-400 hover:text-white transition-colors rounded-lg border border-dark-700/50 hover:border-primary-500/50"
              title="Clear all filters"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Items Display */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-400">No items found</p>
          </div>
        ) : viewType === VIEW_TYPES.GRID ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item._id}
                className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-900/50">
                  <img
                    src={processedImages[item.images[0]] || item.images[0]}
                  alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = item.images[0]; // Fallback to original image
                    }}
                  />
                  {!processedImages[item.images[0]] && (
                    <div className="absolute inset-0 bg-dark-900/50 animate-pulse" />
                  )}
              </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white">{item.name}</h3>
                  <p className="mt-1 text-dark-300 line-clamp-2 text-sm">{item.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-semibold text-primary-400">
                        ${item.price}
                      </span>
                      <span className="text-sm text-dark-400">
                        /{item.period}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                      {item.status}
                  </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-700/50">
                    <Link
                      to={`/items/${item._id}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-dark-700/50 rounded-xl hover:bg-primary-500 transition-all duration-300"
                    >
                      View Details
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-dark-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {filteredItems.map(item => (
                  <tr key={item._id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={processedImages[item.images[0]] || item.images[0]}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-sm text-dark-400 truncate max-w-xs">{item.description}</div>
                      </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'available'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-300">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary-400">${item.price}/{item.period}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/items/${item._id}`}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                  </div>
                )}
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onItemAdded={handleItemAdded}
      />
    </DashboardLayout>
  );
} 

export default MyItems; 