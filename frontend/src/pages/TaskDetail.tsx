import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import type { TaskDetailType } from "@/types/taskTypes";
import taskService from "@/api/taskService";
import Loader from "@/components/Loader";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

function TaskDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskDetailType>();

  const fetchTask = async (id: string) => {
    try {
      setLoading(true);
      const taskResponse = await taskService.getTaskById(id);
      setTask(taskResponse.task);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  if (loading || !task) {
    return <Loader />;
  }
  return (
    <div className="relative flex h-auto min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="mt-6 w-full max-w-7xl px-4">
        <Button
          onClick={() => navigate(-1)}
          className="cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow transition-colors hover:bg-gray-100"
        >
          ← Back
        </Button>
      </div>
      <div className="container mx-auto px-4">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={import.meta.env.VITE_IMAGE_ENDPOINT + task.image_url}
                alt={task.title}
                className="h-[400px] w-full object-cover"
              />
            </div>
            {/* Content Section */}
            <div className="p-6 md:w-1/2 md:p-8">
              <div className="mb-6">
                <div className="mb-2 text-sm font-medium text-blue-600">
                  {task.category}
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {task.title}
                </h1>
                <div className="mb-4 flex items-center text-sm text-gray-500">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  {task.location}
                </div>
                {/* <div className="flex items-center mb-4">
                  <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{task.rating}</span>
                </div> */}
                <div className="mb-4 text-2xl font-bold text-gray-900">
                  ${task.price}/hr
                </div>
              </div>
              {/* Provider Information */}
              <div className="mb-6 border-t border-gray-200 pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  About the Provider
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-gray-100 p-3">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {task.firstName + " " + task.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="mt-1 flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        Member since {dayjs(task.createdAt).year()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="mb-6 border-t border-gray-200 pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="text-gray-600">{task.description}</p>
              </div>
              {/* Book Now Button */}
              <Button
                onClick={() => navigate(`/task/${id}/booking`)}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
