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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "@/components/Loader";
import type { CityType } from "@/types";
import { categories } from "@/mock";
import taskService from "@/api/taskService";
import type { Task } from "@/types/taskTypes";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Tasks() {
  // params
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // task, filter options
  const [taskList, setTaskList] = useState<Task[]>();
  const [cities, setCities] = useState<CityType[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTask();

    fetch("th.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .then(() => setLoading(false));

    if (category) {
      setSelectedCategory(category);
    }

    if (location) {
      setSelectedLocation(location);
    }
    if (query) {
      setSearchQuery(query);
    }
  }, [page, category, location, query]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const tasksResponse = await taskService.getAllTask({
        page: page,
        q: query,
        category: category,
        location: location,
      });
      setTaskList(tasksResponse.data.tasks);
      setCurrentPage(tasksResponse.data.currentPage);
      setTotalPages(tasksResponse.data.totalPages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (category: string) => {
    const newCategoryParams = new URLSearchParams(searchParams.toString());

    newCategoryParams.set("category", category);
    newCategoryParams.set("page", "1");

    setSearchParams(newCategoryParams);
    setSelectedCategory(category);
    
  };

  const handleLocationChange = (location: string) => {
    const newLocationParams = new URLSearchParams(searchParams.toString());
    newLocationParams.set("location", location);
    newLocationParams.set("page", "1");

    setSearchParams(newLocationParams);
    setSelectedLocation(location);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return; // Prevent going to a negative page
    if (newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    const newQueryParams = new URLSearchParams(searchParams.toString());
    newQueryParams.set("q",searchQuery);
    setSearchParams(newQueryParams);
  };

  if (loading && !cities) {
    return <Loader />;
  }
  if (loading || !taskList) {
    return <Loader />;
  }
  return (
    <div className="flex h-auto min-h-[calc(100vh-64px)] flex-col bg-gray-50 pb-4">
      <div className="container mx-auto px-4 pt-12">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Available Services
          </h1>
        </div>
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
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
            onClick={() => handleSearch()}
            size={"lg"}
            className="bg-blue-600 hover:bg-blue-400"
          >
            Search
          </Button>
          <div className="flex gap-4">
            <Select
              defaultValue={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Categories</SelectLabel>
                  {categories && (
                    <>
                      {categories.map((category) => {
                        return (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        );
                      })}
                    </>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              defaultValue={selectedLocation}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Locations</SelectLabel>
                  {cities && (
                    <>
                      {cities.map((city) => (
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
        {taskList.length == 0 ? (
          <div className="container mx-auto p-16 text-center">
            <h1 className="text-xl font-normal">
              Not Found What You're Looking For
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {taskList.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-center">
          {totalPages >= 2 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
