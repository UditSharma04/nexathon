import { useState, useEffect } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import AddItemModal from './AddItemModal';
import { itemsAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { processImage } from '../../utils/imageUtils';
import EditItemModal from './EditItemModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

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

  // Add these states for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Add these states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  // Add this handler for item updates
  const handleItemUpdated = (updatedItem) => {
    setItems(items.map(item => 
      item._id === updatedItem._id ? updatedItem : item
    ));
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

  // Add delete handler
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemsAPI.deleteItem(itemToDelete._id);
      setItems(items.filter(item => item._id !== itemToDelete._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setDeleteLoading(false);
      setItemToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">My Items</h1>
              <p className="text-dark-400 mt-1">Manage your listed items and track their status</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Item
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700/50 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
              >
                <option value="" className="bg-dark-800">All Status</option>
                <option value="available" className="bg-dark-800">Available</option>
                <option value="booked" className="bg-dark-800">Booked</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700/50 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5"
              >
                <option value="newest" className="bg-dark-800">Newest First</option>
                <option value="oldest" className="bg-dark-800">Oldest First</option>
                <option value="price_low" className="bg-dark-800">Price: Low to High</option>
                <option value="price_high" className="bg-dark-800">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-dark-400 animate-pulse">Loading your items...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="space-y-4 text-center">
                <div className="text-4xl">😕</div>
                <div className="text-red-400">{error}</div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 text-sm bg-dark-800/50 hover:bg-dark-700/50 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
              <p className="text-dark-400 mb-6">Start by adding your first item for rent</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id}
                  className="group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 overflow-hidden hover:border-primary-500/20 transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-dark-900">
                    {item.images?.[0] ? (
                      <>
                        {!processedImages[item.images[0]] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
                            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={processedImages[item.images[0]] || item.images[0]}
                          alt={item.name}
                          className={`h-full w-full object-cover ${
                            processedImages[item.images[0]] ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = item.images[0]; // Fallback to original image
                          }}
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
                        <svg className="w-12 h-12 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-white truncate">{item.name}</h3>
                        <p className="text-sm text-dark-400 truncate">Added {item.createdAt}</p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'available' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-medium text-primary-400">${item.price}</span>
                        <span className="text-sm text-dark-400">/{item.period}</span>
                      </div>
                      <div className="text-sm text-dark-400">
                        {item.totalBookings || 0} bookings
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-dark-700/50 rounded-lg hover:bg-primary-500 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-500/20 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onItemAdded={handleItemAdded}
      />

      <EditItemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onItemUpdated={handleItemUpdated}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
} 

export default MyItems; 