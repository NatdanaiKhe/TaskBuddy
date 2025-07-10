import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import type { Task } from "@/types/taskTypes";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";

const CustomerMenu = () => (
  <a href="/tasks" className="text-center text-gray-600 hover:text-blue-600">
    Browse Tasks
  </a>
);

const ProviderMenu = () => (
  <a href="/" className="text-center text-gray-600 hover:text-blue-600">
    Home
  </a>
);

function NavBar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Desktop Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">
              <a href="/">TaskBuddy</a>
            </div>
            <nav className="hidden items-center space-x-8 md:flex">
              {!user || user.role === "customer" ? (
                <CustomerMenu />
              ) : (
                <ProviderMenu />
              )}
            </nav>
          </div>

          {/* Search & User Menu - Desktop */}
          <div className="hidden items-center space-x-4 md:flex">
            {user?.role == "customer" && (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
              />
            )}
            <UserMenu />
          </div>

          {/* Mobile menu toggle */}
          <button className="p-2 md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <XIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <UserMenu />
              {!user || user.role === "customer" ? (
                <CustomerMenu />
              ) : (
                <ProviderMenu />
              )}
              {user?.role == "customer" && (
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
