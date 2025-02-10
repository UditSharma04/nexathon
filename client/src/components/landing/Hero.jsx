import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-dark-900">
      <div className="absolute inset-0 bg-mesh-pattern opacity-20"></div>
      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block">Share Resources,</span>
                    <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">Build Community</span>
                  </h1>
                  <p className="mt-3 text-base text-dark-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Join a community of people sharing resources, reducing waste, and building connections. Share what you have, borrow what you need.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <div className="sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-xl shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 md:py-4 md:text-lg md:px-10 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0"
                        >
                          Get Started
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/about"
                          className="w-full flex items-center justify-center px-8 py-3 border border-dark-700 text-base font-medium rounded-xl text-dark-300 bg-dark-800/50 hover:bg-dark-800 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                <div className="bg-dark-800/50 sm:max-w-md sm:w-full sm:mx-auto sm:rounded-2xl sm:overflow-hidden backdrop-blur-xl border border-dark-700/50">
                  <div className="px-4 py-8 sm:px-10">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-800/50 text-dark-300">Key Statistics</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-400">2.5K+</div>
                        <div className="mt-1 text-sm text-dark-400">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-400">5K+</div>
                        <div className="mt-1 text-sm text-dark-400">Items Shared</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-400">10T</div>
                        <div className="mt-1 text-sm text-dark-400">CO₂ Saved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 