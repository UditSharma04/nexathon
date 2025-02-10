import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Home',
      href: '/home',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Browse Items',
      href: '/items',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'My Items',
      href: '/my-items',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: 'Maps',
      href: '/map',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-dark-800/50 backdrop-blur-xl border-r border-dark-700/50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-dark-700/50">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              ShareHub
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-dark-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 custom-scrollbar">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-1 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-primary-400' : 'text-dark-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="border-t border-dark-700/50 p-4 space-y-2">
            <Link
              to="/profile"
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                location.pathname === '/profile'
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <svg 
                className={`mr-3 h-6 w-6 ${
                  location.pathname === '/profile' 
                    ? 'text-primary-400' 
                    : 'text-dark-400 group-hover:text-white'
                }`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-dark-300 rounded-xl hover:bg-dark-800 hover:text-white transition-colors"
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="min-h-screen">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 flex h-16 items-center border-b border-dark-700/50 bg-dark-900/50 backdrop-blur-xl lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-4 text-dark-300 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              ShareHub
            </span>
          </div>

          {/* Main content area */}
          <main className="p-6 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 