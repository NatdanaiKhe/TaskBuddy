import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      icon: <ClipboardIcon className="w-10 h-10" />,
      title: "Describe your task",
      description: "Tell us what you need help with and when you need it done.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <UserIcon className="w-10 h-10" />,
      title: "Choose a tasker",
      description:
        "Browse profiles, reviews, and prices to find the right skilled tasker.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <CalendarIcon className="w-10 h-10" />,
      title: "Schedule a time",
      description: "Book your task for whenever is most convenient for you.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <CheckCircleIcon className="w-10 h-10" />,
      title: "Get it done",
      description: "Your tasker arrives and completes the job while you relax.",
      color: "bg-purple-100 text-purple-600",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`${step.color} p-4 rounded-full mb-4`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition shadow-md">
            <a href="/tasks">Get Started</a>
          </button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
