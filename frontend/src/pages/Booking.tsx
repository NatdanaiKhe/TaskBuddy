import taskService from "@/api/taskService";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/useAuth";
import type { TaskDetailType } from "@/types/taskTypes";
import { CalendarDays, ChevronDownIcon, Clock, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hourOptions } from "@/mock";
import type { BookingForm } from "@/types/bookingTypes";
import { useForm } from "react-hook-form";

function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskDetailType>();
  const [open, setOpen] = useState(false);

  // form
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState('1');
  const totalPrice = task
    ? Number(duration) * task.price
    : Number(duration) * 0;

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors,isSubmitting },
  } = useForm<BookingForm>({
    mode: "onBlur",
  });

  const fetchTask = async (id: string) => {
    try {
      setLoading(true);
      const taskResponse = await taskService.getTaskById(id);
      console.log("taskResponse: ", taskResponse);

      setTask(taskResponse.task);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "customer") {
      console.log("Redirecting from booking");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const handleDurationChange = (value: string) => {
    setValue("duration", value, { shouldValidate: true });
    setDuration(value);
  };

  const handleDateSelect = (date: Date) => {
    if (date) {
      setDate(date); 
      setValue("date", date, { shouldValidate: true });
      trigger("date");
      setOpen(false);
    }
  };



  const onSubmit = (data:BookingForm) => {
    console.log("booking form data :",data);
    
    // call booking api
  };

  if (loading) {
    return <Loader />;
  }

  if (!task) {
    return <h1>not found</h1>;
  }
  return (
    <div className="flex h-auto min-h-[calc(100vh-64px)] flex-col items-start gap-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col">
          <h1 className="my-8 text-left text-2xl font-bold">
            Book This Service
          </h1>
          <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="flex items-start space-x-4 p-6">
              <img
                src={import.meta.env.VITE_IMAGE_ENDPOINT + task.image_url}
                alt={task.title}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div>
                <div className="mb-1 text-sm font-medium text-blue-600">
                  {task.category}
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {task.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  {task.location}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  by {task.firstName + " " + task.lastName}
                </div>
              </div>
            </div>
          </div>
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Date Fields */}
              <div>
                <Label htmlFor="date" className="mb-2">
                  <CalendarDays className="mr-1 inline h-4 w-4" />
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      required
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={handleDateSelect}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
              {/* Start Time Fields */}
              <div>
                <Label htmlFor="time" className="mb-2">
                  <Clock className="mr-1 inline h-4 w-4" />
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue="10:30:00"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {errors.startTime && (
                  <p className="text-sm text-red-600">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
            </div>
            {/* Duration Fields */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Duration (hours)
              </Label>
              <Select
                defaultValue={duration}
                onValueChange={handleDurationChange}
                {...register("duration", { required: "Duration is required" })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>All Categories</SelectLabel>
                    {hourOptions && (
                      <>
                        {hourOptions.map((hour) => {
                          return (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          );
                        })}
                      </>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>
            {/* Additional Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                placeholder="Add any special requirements or instructions..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {/* Price Summary */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-gray-600">Service Rate</span>
                <span className="text-gray-900">${task.price}/hr</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900">{duration} hours</span>
              </div>
              <div className="my-2 border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    ฿{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;
