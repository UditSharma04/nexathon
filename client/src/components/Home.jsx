import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 bg-mesh-pattern">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-dark-800/30 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              Welcome to ShareHub
            </h1>
            <button 
              onClick={logout}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-200 ease-in-out transform hover:translate-y-[-1px] active:translate-y-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 