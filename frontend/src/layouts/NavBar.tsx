import { useState } from "react";
import { SearchIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuList = (
    <>
      <a href="/tasks" className="text-gray-600 hover:text-blue-600 text-center">
        Browse Tasks
      </a>
      <a href="/register" className="text-gray-600 hover:text-blue-600 text-center">
        Become a Tasker
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">TaskBuddy</div>
            </div>

            {/* Desktop  */}
            <nav className="hidden md:flex items-center space-x-8">
              {MenuList}
            </nav>
          </div>

          {/* Search and User */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 md:w-[150px] lg:w-[300px] pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <UserIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {MenuList}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
