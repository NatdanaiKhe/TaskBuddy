import { SearchIcon } from "lucide-react";
import SearchResult from "./SearchResult";
import { Input } from "./ui/input";
import taskService from "@/api/taskService";
import { useEffect } from "react";
import type { Task } from "@/types/taskTypes";

function SearchBar({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: Task[];
  setSearchResults: (results: Task[]) => void;
}) {
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) return;
      try {
        const results = await taskService.getAllTask({ q: searchQuery });
        setSearchResults(results.data.tasks || []);
      } catch (error) {
        console.error("Error searching task:", error);
      }
    };
    const debounce = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-full border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-[150px] lg:w-[300px]"
      />
      <SearchIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <SearchResult results={searchResults} setResults={setSearchResults} />
    </div>
  );
}

export default SearchBar;
