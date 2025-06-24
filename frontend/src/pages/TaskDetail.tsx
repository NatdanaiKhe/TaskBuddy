import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { tasks } from "@/mock";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";

function TaskDetail() {
  const { id } = useParams();
  const [loading,setLoading] = useState(false);
  return (
    <div className="flex flex-col justify-center bg-gray-50 items-center min-h-[calc(100vh-64px)] h-auto">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={tasks[0].image}
                alt={tasks[0].title}
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Content Section */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="mb-6">
                <div className="text-sm text-blue-600 font-medium mb-2">
                  {tasks[0].category}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {tasks[0].title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {tasks[0].location}
                </div>
                {/* <div className="flex items-center mb-4">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{tasks[0].rating}</span>
                </div> */}
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  ${tasks[0].price}/hr
                </div>
              </div>
              {/* Provider Information */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About the Provider
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <UserIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Natdanai Khemtong
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mt-1">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Member since 2020
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600">{tasks[0].description}</p>
              </div>
              {/* Book Now Button */}
              <button
                
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
