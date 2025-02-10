import { useState, useEffect } from 'react';
import { itemsAPI } from '../../services/api';

export default function EditItemModal({ isOpen, onClose, item, onItemUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    period: 'day',
    condition: '',
    insurance: '',
    images: [''],
    features: [''],
    rules: [''],
    status: 'available'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form with item data when modal opens
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        period: item.period,
        condition: item.condition,
        insurance: item.insurance,
        images: item.images.length ? item.images : [''],
        features: item.features.length ? item.features : [''],
        rules: item.rules.length ? item.rules : [''],
        status: item.status
      });
    }
  }, [item]);

  const handleArrayInputChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanedData = {
        ...formData,
        price: Number(formData.price),
        insurance: Number(formData.insurance),
        images: formData.images.filter(url => url.trim()),
        features: formData.features.filter(feature => feature.trim()),
        rules: formData.rules.filter(rule => rule.trim())
      };

      const response = await itemsAPI.updateItem(item._id, cleanedData);
      
      if (onItemUpdated) {
        onItemUpdated(response.data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-white">Edit Item</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider border-b border-dark-700/50 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="tools">Tools</option>
                    <option value="electronics">Electronics</option>
                    <option value="sports">Sports</option>
                    <option value="camping">Camping</option>
                    <option value="party">Party</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50"
                >
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 min-h-[120px]"
                />
              </div>
            </div>

            {/* Rest of the form fields similar to AddItemModal */}
            {/* ... */}

          </div>

          {error && (
            <div className="px-6 py-3 text-red-400 text-sm">{error}</div>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-4 bg-[#1A1A1A] border-t border-dark-700/50 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-dark-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 