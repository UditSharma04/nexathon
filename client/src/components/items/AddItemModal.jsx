import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function AddItemModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    condition: '',
    price: '',
    period: 'day',
    insurance: '',
    images: [],
    availability: {
      startDate: '',
      endDate: '',
      excludeDates: [],
    },
    location: {
      address: '',
      city: '',
      postcode: '',
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 5,
    onDrop: acceptedFiles => {
      setFormData(prev => ({
        ...prev,
        images: acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))
      }));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // TODO: Submit form data to API
    console.log('Form submitted:', formData);
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-300">
                Item Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., Power Drill"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-dark-300">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="tools">Tools</option>
                <option value="sports">Sports Equipment</option>
                <option value="electronics">Electronics</option>
                <option value="camping">Camping Gear</option>
                <option value="kitchen">Kitchen Appliances</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-dark-300">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Describe your item, including any special features or instructions"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-dark-300">
                Condition
              </label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300">
                Photos
              </label>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-700/50 border-dashed rounded-lg cursor-pointer hover:border-primary-500/50 transition-colors"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-dark-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-dark-400">
                    <input {...getInputProps()} />
                    <p>Drop images here or click to upload</p>
                  </div>
                  <p className="text-xs text-dark-400">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.images.map((file) => (
                    <img
                      key={file.name}
                      src={file.preview}
                      alt={file.name}
                      className="h-24 w-full object-cover rounded-lg"
                      onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-dark-300">
                  Price
                </label>
                <div className="mt-1 relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-dark-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="block w-full pl-7 rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="period" className="block text-sm font-medium text-dark-300">
                  Per
                </label>
                <select
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="insurance" className="block text-sm font-medium text-dark-300">
                Insurance Value
              </label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-dark-400 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="insurance"
                  value={formData.insurance}
                  onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                  className="block w-full pl-7 rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Item value for insurance"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300">
                Location
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Street address"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className="block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={formData.location.postcode}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, postcode: e.target.value }
                  })}
                  className="block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300">
                Availability
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-400">Start Date</label>
                  <input
                    type="date"
                    value={formData.availability.startDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, startDate: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400">End Date</label>
                  <input
                    type="date"
                    value={formData.availability.endDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, endDate: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 p-6 shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-white">List Your Item</h3>
            <div className="mt-2 flex items-center space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex items-center ${i < step ? 'text-primary-400' : i === step ? 'text-white' : 'text-dark-400'}`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    i < step ? 'bg-primary-500' : i === step ? 'bg-dark-700' : 'bg-dark-800'
                  }`}>
                    {i < step ? (
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i
                    )}
                  </span>
                  <span className="ml-2 text-sm">
                    {i === 1 ? 'Details' : i === 2 ? 'Photos & Pricing' : 'Location'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="mt-6 flex justify-end space-x-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white rounded-xl hover:bg-dark-700/50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
              >
                {step === 3 ? 'List Item' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 