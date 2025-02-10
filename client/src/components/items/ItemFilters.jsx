export default function ItemFilters({ filters, setFilters }) {
  return (
    <div className="flex items-center space-x-4">
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
      >
        <option value="all">All Categories</option>
        <option value="tools">Tools</option>
        <option value="sports">Sports Equipment</option>
        <option value="electronics">Electronics</option>
        <option value="camping">Camping Gear</option>
        <option value="kitchen">Kitchen Appliances</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
      >
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        className="bg-dark-800/50 border border-dark-700/50 text-dark-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A-Z</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
} 