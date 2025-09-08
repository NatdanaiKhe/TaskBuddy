export type BookingStatus = "pending" | "accepted" | "cancelled" | "completed";

export interface BookingType {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  date: Date;
  start_time: string;
  duration: number;
  total_price: number;
  notes?: string;
  status: BookingStatus;
}
export interface BookingForm {
  task_id: string;
  date: Date;
  start_time: string;
  duration: string;
  notes: string;
  total_price: number;
}

// Get status badge color
export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
