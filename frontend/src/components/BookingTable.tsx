import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BookingType } from "@/types/bookingTypes";
import dayjs from "dayjs";

type BookingTableProps = {
  bookings: BookingType[];
  onAction?: (id: string) => void;
  getStatusBadgeClass: (status: string) => string;
};

export default function BookingTable({
  bookings,
  onAction,
  getStatusBadgeClass
}: BookingTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            {onAction && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.title}</TableCell>
              <TableCell>{booking.firstName + " " + booking.lastName}</TableCell>
              <TableCell>{`${dayjs(booking.date).format("DD-MM-YYYY")} at ${booking.start_time}`}</TableCell>
              <TableCell>{booking.duration} hours</TableCell>
              <TableCell>${booking.total_price}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold ${getStatusBadgeClass(
                    booking.status,
                  )}`}
                >
                  {booking.status}
                </span>
              </TableCell>
              {onAction && (
                <TableCell>
                  <button
                    onClick={() => onAction(booking.id)}
                    className="text-sm text-blue-600 hover:text-blue-900"
                  >
                    Mark Complete
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
