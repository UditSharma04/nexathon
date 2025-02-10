export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Delete Item</h2>
          <p className="text-dark-300">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-dark-800/30 rounded-b-2xl flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 