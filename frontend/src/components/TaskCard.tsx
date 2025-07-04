import type { TaskCardProps } from "@/types/taskTypes";
import { MapPinIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
function TaskCard({
  id,
  title,
  category,
  price,
  location,
  image_url,
}: TaskCardProps) {
  const navigate = useNavigate();
  const img_url = import.meta.env.VITE_IMAGE_ENDPOINT + image_url;


  const redirectBooking = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/task/${id}/booking`);
  };
  return (
    <div
      onClick={() => navigate(`/task/${id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img src={img_url} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="text-sm font-medium text-blue-600 mb-1">{category}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-bold text-gray-800">฿{price}</div>
          <Button onClick={redirectBooking} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
