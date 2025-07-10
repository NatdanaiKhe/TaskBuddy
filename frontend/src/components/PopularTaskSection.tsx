import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import taskService from "@/api/taskService";
import type { Task } from "@/types/taskTypes";
import Loader from "./Loader";
function PopularTaskSection() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>();

  const fetchLatestTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getAllTask({ limit: 4 });
      if (!res.ok) {
        console.log("error");
      }

      setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestTasks();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if(!tasks){
    return <h1>not found</h1>
  }
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Popular Tasks</h2>
          <a href="/tasks" className="font-medium text-blue-600 hover:text-blue-700">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tasks.map((task, index) => (
            <TaskCard key={index} {...task} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTaskSection;
