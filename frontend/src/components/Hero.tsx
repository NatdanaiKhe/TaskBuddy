import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { popularTask } from "@/mock/index";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    navigate(`/tasks/?q=${searchQuery}`);
  };

  return (
    <section className="bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Get help with everyday tasks
          </h1>
          <p className="mb-8 text-lg text-gray-700 md:text-xl">
            Connect with skilled taskers to help with cleaning, delivery,
            furniture assembly, and more.
          </p>
          <div className="flex w-full max-w-md flex-col items-center gap-2 md:flex-row">
            <div className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder="What do you need help with?"
                className="h-10 w-full border border-gray-300 bg-white pr-16 pl-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Search for tasks"
                autoComplete="off"
                autoFocus
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <SearchIcon className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 transform text-gray-500" />
            </div>
            <Button
              size={"lg"}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-400 md:w-[100px]"
              onClick={() => handleSearch()}
            >
              Search
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {popularTask.map((task, index) => (
              <span
                key={index}
                className="cursor-pointer rounded-full bg-white px-4 py-2 shadow-sm transition-colors hover:bg-blue-50"
              >
                <a href={`/tasks?category=${task.value}`}>{task.label}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
