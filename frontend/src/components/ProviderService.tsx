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
import ProviderServiceForm from "@/components/ProviderTaskForm";
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
import { Badge } from "@/components/ui/badge";
import type { Task, TaskCardProps, TaskFormValues } from "@/types/taskTypes";
import Loader from "./Loader";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import taskService from "@/api/taskService";
import { useAuth } from "@/context/useAuth";
import { useForm } from "react-hook-form";

function ProviderService() {
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
    <div className="flex flex-col gap-8 rounded bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Services</h2>
        <Button
          onClick={handleOpenDialog}
          className="bg-blue-600 hover:bg-blue-400"
        >
          <Plus />
          <span className="hidden sm:inline">Add New Service</span>
        </Button>
      </div>
      <Toaster />
      {/* alert dialog */}
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              tasks and remove it data from our servers.
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

      {/* Pop form */}
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
              className="bg-blue-600 hover:bg-blue-400"
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
            {taskList.map((task) => (
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
                    className="mr-4 bg-transparent text-blue-600 hover:bg-gray-50 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task)}
                    className="bg-transparent text-red-600 hover:bg-gray-50 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex w-full items-center justify-center">
          <h1>You didn't have any task yet</h1>
        </div>
      )}
    </div>
  );
}

export default ProviderService;
