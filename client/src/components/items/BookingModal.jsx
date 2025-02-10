import { useState } from 'react';

export default function BookingModal({ isOpen, onClose, item, selectedDate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    message: '',
    paymentMethod: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // TODO: Submit booking request to API
    console.log('Booking submitted:', { ...formData, date: selectedDate });
    onClose();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300">
                Pickup Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300">
                Return Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300">
                Message to Owner
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Introduce yourself and explain your project..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-dark-800/50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-white">Booking Summary</h4>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-300">Date</span>
                  <span className="text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-300">Time</span>
                  <span className="text-white">{formData.startTime} - {formData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-300">Rate</span>
                  <span className="text-white">${item.price}/{item.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-300">Insurance Deposit</span>
                  <span className="text-white">${item.insurance}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-dark-700/50 flex justify-between font-medium">
                  <span className="text-dark-300">Total</span>
                  <span className="text-primary-400">${item.price + item.insurance}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="mt-1 block w-full rounded-lg bg-dark-900/50 border border-dark-700/50 text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Select payment method</option>
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-dark-800/50 rounded-xl p-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-primary-400">
                    {item.owner.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{item.owner.name}</p>
                  <p className="text-xs text-dark-400">
                    Usually responds within {item.owner.responseTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="h-4 w-4 rounded border-dark-700/50 bg-dark-900/50 text-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-dark-300">
                    I agree to treat the item with care and follow all usage rules. I understand that I'm responsible for any damage beyond normal wear and tear.
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            <h3 className="text-lg font-medium text-white">Book {item.name}</h3>
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
                    {i === 1 ? 'Details' : i === 2 ? 'Payment' : 'Confirm'}
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
                disabled={step === 3 && !formData.agreeToTerms}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 disabled:opacity-50 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
              >
                {step === 3 ? 'Send Request' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 