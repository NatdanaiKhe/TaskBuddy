import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Get help with everyday tasks
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Connect with skilled taskers to help with cleaning, delivery,
            furniture assembly, and more.
          </p>
          <div className="flex flex-col md:flex-row items-center w-full max-w-md">
          <div className="w-full max-w-xl relative">
            <Input
              type="text"
              placeholder="What do you need help with?"
              className="w-full h-10 pl-12 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search for tasks"
              autoComplete="off"
              autoFocus
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
          </div>
          <Button size={'lg'} className="bg-blue-600 hover:bg-blue-400 cursor-pointer">Search</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
