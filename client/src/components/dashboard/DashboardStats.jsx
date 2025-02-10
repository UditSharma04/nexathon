export default function DashboardStats() {
  const stats = [
    {
      name: 'Active Listings',
      value: '12',
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Active Bookings',
      value: '3',
      change: '+1',
      changeType: 'increase',
    },
    {
      name: 'Total Earnings',
      value: '$1,423',
      change: '+$231',
      changeType: 'increase',
    },
    {
      name: 'Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'increase',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative group bg-dark-800/30 backdrop-blur-xl rounded-xl border border-dark-700/50 p-6 hover:border-primary-500/20 transition-all duration-300"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
          <div className="relative">
            <dt className="text-sm font-medium text-dark-300">{stat.name}</dt>
            <dd className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </p>
            </dd>
          </div>
        </div>
      ))}
    </div>
  );
} 