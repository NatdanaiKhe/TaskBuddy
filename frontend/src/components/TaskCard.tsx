import type { TaskCardProps } from "@/types/taskTypes";
import { MapPinIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
function TaskCard({
  title,
  category,
  price,
  location,
  image,
}: TaskCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/task/1`)}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="text-sm font-medium text-blue-600 mb-1">{category}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        {/* <div className="flex items-center mb-3">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {rating}
            </span>
          </div>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{reviews} reviews</span>
        </div> */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-bold text-gray-800">{price}</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
