function Navbar() {
    return (
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 text-xl font-bold text-blue-600">
              MarketAI
            </div>
  
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Dashboard</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Insights</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Assets</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Settings</a>
            </div>
  
            {/* Right-side CTA / Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
  