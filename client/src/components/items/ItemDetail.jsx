import { useParams } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';

export default function ItemDetail() {
  const { id } = useParams();

  // Mock data - replace with API call
  const item = {
    id: 1,
    name: 'Mountain Bike',
    category: 'sports',
    status: 'available',
    description: 'High-quality mountain bike, perfect for weekend adventures. Features front suspension, 21 speeds, and disc brakes. Ideal for both beginners and intermediate riders.',
    price: 25,
    period: 'day',
    rating: 4.8,
    totalBookings: 12,
    owner: {
      name: 'Sarah Wilson',
      rating: 4.9,
      totalItems: 5,
      memberSince: 'Jan 2024',
    },
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bW91bnRhaW4lMjBiaWtlfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Image Gallery and Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Item Info */}
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">{item.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.status === 'available'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 flex items-center text-dark-400">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm">{item.rating}</span>
              <span className="mx-2">•</span>
              <span className="text-sm">{item.totalBookings} bookings</span>
            </div>

            <p className="mt-4 text-dark-300">{item.description}</p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-400">
                  ${item.price}
                </span>
                <span className="text-dark-400 ml-1">
                  /{item.period}
                </span>
              </div>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0">
                Book Now
              </button>
            </div>

            {/* Owner Info */}
            <div className="mt-8 pt-6 border-t border-dark-700/50">
              <h3 className="text-lg font-medium text-white">About the Owner</h3>
              <div className="mt-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-primary-400">
                    {item.owner.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-white">{item.owner.name}</h4>
                  <div className="mt-1 flex items-center text-dark-400">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm">{item.owner.rating}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{item.owner.totalItems} items</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">Member since {item.owner.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 