
import TaskCard from "./TaskCard";
import { tasks } from "@/mock";
function PopularTaskSection() {
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Popular Tasks</h2>
          <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tasks.map((task, index) => (
            <TaskCard
              key={index}
              {...task}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTaskSection;
