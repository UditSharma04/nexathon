import { useState } from 'react';
import axios from '../../utils/axios';

const API_URL = 'https://sharehub-q3oi.onrender.com'; // Update API URL

export default function AddItemModal({ isOpen, onClose, onItemAdded }) {
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
    location: {
      coordinates: [80.1534, 12.8406]
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      console.log('Submitting item:', cleanedData);

      const response = await axios.post('/api/items', cleanedData);
      console.log('Item created:', response.data);
      
      if (onItemAdded) {
        onItemAdded(response.data);
      }
      onClose();
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to create item');
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
          <h2 className="text-2xl font-semibold text-white">Add New Item</h2>
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
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 bg-[#242424] rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#242424] text-white">Select category</option>
                      <option value="tools" className="bg-[#242424] text-white">Tools</option>
                      <option value="electronics" className="bg-[#242424] text-white">Electronics</option>
                      <option value="sports" className="bg-[#242424] text-white">Sports</option>
                      <option value="camping" className="bg-[#242424] text-white">Camping</option>
                      <option value="party" className="bg-[#242424] text-white">Party</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50 min-h-[120px] resize-none"
                  placeholder="Describe your item..."
                />
              </div>
            </div>

            {/* Pricing & Condition */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider border-b border-dark-700/50 pb-2">
                Pricing & Condition
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-dark-400">$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Period</label>
                  <div className="relative">
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 bg-[#242424] rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer"
                    >
                      <option value="hour" className="bg-[#242424] text-white">Per Hour</option>
                      <option value="day" className="bg-[#242424] text-white">Per Day</option>
                      <option value="week" className="bg-[#242424] text-white">Per Week</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Condition</label>
                  <div className="relative">
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 bg-[#242424] rounded-lg border border-dark-700/50 text-white focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#242424] text-white">Select condition</option>
                      <option value="new" className="bg-[#242424] text-white">New</option>
                      <option value="like-new" className="bg-[#242424] text-white">Like New</option>
                      <option value="good" className="bg-[#242424] text-white">Good</option>
                      <option value="fair" className="bg-[#242424] text-white">Fair</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Insurance Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-dark-400">$</span>
                    <input
                      type="number"
                      value={formData.insurance}
                      onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider border-b border-dark-700/50 pb-2">
                  Images
                </h3>
                <button
                  type="button"
                  onClick={() => addArrayField('images')}
                  className="text-sm text-dark-400 hover:text-primary-300"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleArrayInputChange('images', index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-4 py-2 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('images', index)}
                        className="px-3 py-2 text-dark-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider border-b border-dark-700/50 pb-2">
                  Features
                </h3>
                <button
                  type="button"
                  onClick={() => addArrayField('features')}
                  className="text-sm text-dark-400 hover:text-primary-300"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayInputChange('features', index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-4 py-2 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('features', index)}
                      className="px-3 py-2 text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider border-b border-dark-700/50 pb-2">
                  Rules
                </h3>
                <button
                  type="button"
                  onClick={() => addArrayField('rules')}
                  className="text-sm text-dark-400 hover:text-primary-300"
                >
                  + Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => handleArrayInputChange('rules', index, e.target.value)}
                      placeholder="Rule description"
                      className="flex-1 px-4 py-2 bg-[#242424] rounded-lg border border-dark-700/50 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField('rules', index)}
                      className="px-3 py-2 text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
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
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 