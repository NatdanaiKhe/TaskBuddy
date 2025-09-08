import taskService from "@/api/taskService";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { isBefore } from "date-fns";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/useAuth";
import type { TaskDetailType } from "@/types/taskTypes";
import { CalendarDays, ChevronDownIcon, Clock, MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hourOptions } from "@/mock/index";
import type { BookingForm } from "@/types/bookingTypes";
import { useForm } from "react-hook-form";
import bookingService from "@/api/bookingService";

function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskDetailType>();
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // form
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    mode: "onBlur",
    defaultValues: {
      duration: "1",
      date: undefined,
      start_time: "",
      notes: "",
    },
  });

  const duration = watch("duration");
  const date = watch("date");
  const totalPrice = task ? Number(duration) * task.price : 0;

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

  const onSubmit = async (data: BookingForm) => {
    console.log("data form:",data);
    
    data.total_price = totalPrice;
    data.task_id = id!;

    try {
      const res = await bookingService.booking(data);
      
      if (res.success) {
        setAlertOpen(true);
      }

    } catch (error) {
      if (error instanceof Error) {
        toast.error("Something went wrong while booking the task.");
      }
    }
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
          <Toaster />
          <AlertDialog open={alertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Booking Success</AlertDialogTitle>
                <AlertDialogDescription>
                 Please wait for provider to confirm this booking.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    navigate('/')
                  }}
                >
                  Back
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={()=>navigate('/bookings')}
                  className="bg-blue-500 hover:bg-blue-700"
                >
                  View Your Booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                      {date
                        ? new Date(date).toLocaleDateString()
                        : "Select date"}
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
                      selected={date ? new Date(date) : undefined}
                      captionLayout="dropdown"
                      disabled={(date) => isBefore(date, new Date())}
                      onSelect={(selectedDate: Date | undefined) => {
                        if (selectedDate) {
                          setValue("date", selectedDate, {
                            shouldValidate: true,
                          });
                          trigger("date");
                          setOpen(false);
                        }
                      }}
                      {...register("date", {
                        required: "Date is required",
                      })}
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
                  {...register("start_time", {
                    required: "Start time is required",
                  })}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {errors.start_time && (
                  <p className="text-sm text-red-600">
                    {errors.start_time.message}
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
                onValueChange={(value) => {
                  setValue("duration", value, { shouldValidate: true });
                  trigger("duration");
                }}
                {...register("duration", {
                  required: "Duration is required",
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>All Durations</SelectLabel>
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
            <div className="px-6 py-4">
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
