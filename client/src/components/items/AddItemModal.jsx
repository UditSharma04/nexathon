import { useEffect } from 'react';

export default function AddItemModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 p-6 shadow-xl transition-all">
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

          <h3 className="text-lg font-medium leading-6 text-white mb-4">
            Add New Item
          </h3>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-dark-300">
                Category
              </label>
              <select
                name="category"
                id="category"
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
                name="description"
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-dark-300">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="period" className="block text-sm font-medium text-dark-300">
                  Period
                </label>
                <select
                  name="period"
                  id="period"
                  className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="hour">Per Hour</option>
                  <option value="day">Per Day</option>
                  <option value="week">Per Week</option>
                  <option value="month">Per Month</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300">
                Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-700/50 border-dashed rounded-lg">
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
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md font-medium text-primary-400 hover:text-primary-300"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-dark-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white rounded-xl hover:bg-dark-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 