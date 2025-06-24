import TaskCard from "@/components/TaskCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/Loader";
import type { CityType } from "@/types";
import { tasks, categories } from "@/mock";

function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [cities, setCities] = useState<CityType[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(categories);
    
    fetch("th.json")
      .then(res => res.json())
      .then(data => setCities(data))
      .then(() => setLoading(false));
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (select: string) => {
    setSelectedCategory(select);
  };

  const handleLocationChange = (select: string) => {
    console.log(cities);
    setSelectedLocation(select);
  };
  if (loading && !cities) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] h-auto bg-gray-50 pb-4">
      <div className="container mx-auto px-4 pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Services
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <Input
              type="text"
              placeholder="What do you need help with?"
              className="w-full h-10 pl-12 pr-16  bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search for tasks"
              autoComplete="off"
              autoFocus
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
          </div>
          <div className="flex gap-4">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Categories</SelectLabel>
                  {categories && (
                    <>
                      {categories.map(category => {
                        return <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>;
                      })}
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={handleLocationChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Locations</SelectLabel>
                  {cities && (
                    <>
                      {cities.map(city => (
                        <SelectItem key={city.name_en} value={city.name_en}>
                          {city.name_en}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <TaskCard key={index} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
