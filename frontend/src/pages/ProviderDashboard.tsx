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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string>();

  const fetchTask = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const tasks = await taskService.getTaskByProviderId(user.id);
      console.log(taskList);

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

  const fetchDeleteTask = async () => {
    try {
      setLoading(true);
      if (!deleteItem) return;

      const result = await taskService.deleteTask(deleteItem);
      if (result.success === true) {
        toast.success("Task deleted successfully");
        fetchTask();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Task deleted failed");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // initial form and related function
  const form = useForm<TaskFormValues>({
    mode: "onBlur",
  });

  const { formState } = form;

  const onSubmit = async (data: TaskFormValues) => {
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

  const handleDeleteTask = (task: TaskCardProps) => {
    setDeleteItem(task.id);
    setAlertOpen(true);
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
          <Toaster />
          {/* alert dialog */}
          <AlertDialog open={alertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your tasks and remove it data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={fetchDeleteTask}
                  className="bg-red-500 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

          {taskList.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Service</TableHead>
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
                      <Button
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 hover:text-red-900 bg-transparent hover:bg-gray-50"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center w-full">
              <h1>You didn't have any task yet</h1>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProviderDashboard;
