import {
  BriefcaseIcon,
  HeartIcon,
  HomeIcon,
  PackageIcon,
  TruckIcon,
  Wrench,
} from "lucide-react";
import React from "react";

function CategorySection() {
  const categories = [
    {
      name: "Home Cleaning",
      icon: <HomeIcon className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Delivery",
      icon: <TruckIcon className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Handyman",
      icon: <Wrench className="w-8 h-8" />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      name: "Moving",
      icon: <BriefcaseIcon className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Shopping",
      icon: <PackageIcon className="w-8 h-8" />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Personal Assistance",
      icon: <HeartIcon className="w-8 h-8" />,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center cursor-pointer">
              <div className={`${category.color} p-4 rounded-full mb-4`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
