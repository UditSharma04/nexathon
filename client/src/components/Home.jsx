import { useAuth } from '../context/AuthContext';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardStats from './dashboard/DashboardStats';
import ActiveBookings from './dashboard/ActiveBookings';
import NearbyItems from './dashboard/NearbyItems';

export default function Home() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="mt-2 text-dark-300">
            Here's what's happening with your shared items and bookings.
          </p>
        </div>

        {/* Stats grid */}
        <DashboardStats />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveBookings />
          <NearbyItems />
        </div>
      </div>
    </DashboardLayout>
  );
} 