import { Button } from "@/components/ui/button";
import { PencilIcon, Plus, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogTitle,
  DialogContent,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import type { TaskCardProps, TaskFormValues } from "@/types/taskTypes";
import ProviderServiceForm from "@/components/ProviderTaskForm";
import { useForm } from "react-hook-form";
import taskService from "@/api/taskService";
import type { Task } from "@/types/taskTypes";
import { useAuth } from "@/context/useAuth";
import Loader from "@/components/Loader";

function ProviderDashboard() {
  const { user } = useAuth();
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<TaskCardProps | null>();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);
      if(!user?.id) return;
      const tasks = await taskService.getTaskByProviderId(user.id);
      console.log("tasks:", tasks.task);
      setTaskList(tasks.task);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Fetch error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  },[]);

  // initial form and related function
  const form = useForm<TaskCardProps>({
    mode: "onBlur",
  });

  const { formState } = form;

  const onSubmit = async (data: TaskFormValues) => {
    console.log("submit data:", data);
    try {
      if (editingService) {
        await taskService.updateTask(editingService.id, data);
        toast.success("Task updated successfully");
      } else {
        await taskService.createTask(data);
        toast.success("Task created successfully");
      }
      fetchTask();
      setIsAddingService(false);
      setEditingService(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Something went wrong while saving the task.");
      } else {
        toast.error("Something went wrong while saving the task.");
      }
    }
  };

  // event handler
  const handleEditTask = (task: TaskCardProps) => {
    setEditingService(task);
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setIsAddingService(true);
  };
  const handleCloseDialog = () => {
    setIsAddingService(false);
    setEditingService(null);
    setIsAddingService(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] h-auto bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <h2 className="text-md ">Manage you services and bookings</h2>
        </div>
        <div className="flex flex-col bg-white rounded shadow-sm p-6 gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Services</h2>
            <Button
              onClick={handleOpenDialog}
              className="bg-blue-600 hover:bg-blue-400"
            >
              <Plus />
              Add New Service
            </Button>
          </div>
          <Toaster/>
          <Dialog
            defaultOpen={false}
            open={isAddingService}
            onOpenChange={handleCloseDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Task" : "Add New Task"}
                </DialogTitle>
              </DialogHeader>
              <ProviderServiceForm
                form={form}
                onSubmit={onSubmit}
                initialData={editingService}
              />
              <DialogFooter className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  disabled={formState.isSubmitting}
                  form="task-form"
                  type="submit"
                  className=" bg-blue-600 hover:bg-blue-400"
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-bold">{task.title}</TableCell>
                  <TableCell>{task.category}</TableCell>
                  <TableCell>{task.price}</TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        task.is_active == true
                          ? "bg-green-300 text-green-900"
                          : "bg-red-300 text-red-900"
                      }
                    >
                      {task.is_active == true ? "active" : "closed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-600 hover:text-blue-900 mr-4 bg-transparent hover:bg-gray-50"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Button>
                    <Button className="text-red-600 hover:text-red-900 bg-transparent hover:bg-gray-50">
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

export default ProviderDashboard;
