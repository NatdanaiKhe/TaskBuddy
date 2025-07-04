import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Input } from "@/components/ui/input";
import type { Task } from "@/types/taskTypes";
import taskService from "@/api/taskService";
import SearchResult from "@/components/SearchResult";
function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  

  const MenuList = (
    <>
      <a
        href="/tasks"
        className="text-center text-gray-600 hover:text-blue-600"
      >
        Browse Tasks
      </a>
    </>
  );

  const ProviderMenuList = (
    <>
      <a href="/" className="text-center text-gray-600 hover:text-blue-600">
        My Task
      </a>
      <a
        href="/booking"
        className="text-center text-gray-600 hover:text-blue-600"
      >
        My Booking
      </a>
    </>
  );

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === "") return;
      try {
        const results = await taskService.getAllTask({q:searchQuery});
        setSearchResults(results.data.tasks || []);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    };

    const debounceTimeout = setTimeout(handleSearch, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Even handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                <a href="/">TaskBuddy</a>
              </div>
            </div>

            {/* Desktop  */}
            <nav className="hidden items-center space-x-8 md:flex">
              {!user || user.role == "customer" ? MenuList : ProviderMenuList}
            </nav>
          </div>

          {/* Search and User */}
          <div className="hidden items-center space-x-4 md:flex">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-full border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-[150px] lg:w-[300px]"
              />
              <SearchIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <SearchResult
                results={searchResults}
                setResults={setSearchResults}
              />
            </div>
            {!user && (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="rounded-full bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {user.firstName + " " + user.lastName}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Task</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    <a
                      onClick={() => {
                        logout();
                      }}
                    >
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {MenuList}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full rounded-full border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <SearchIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              {!user && (
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="rounded-full bg-blue-600 py-2 text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </button>
              )}
              {user && (
                <div className="flex flex-col space-y-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {user.firstName + " " + user.lastName}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>My Task</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;
