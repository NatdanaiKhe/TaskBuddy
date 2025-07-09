import { CalendarIcon, CheckIcon, ClockIcon, UserIcon, XIcon } from "lucide-react";
import type { BookingType } from "@/types/bookingTypes";
import { Button } from "./ui/button";
import dayjs from "dayjs";


type BookingConfirmCardProps = {
  key:string;
  booking: BookingType;
  updateBookingStatus: (bookingId: string, status: string) => void;
  getStatusBadgeClass: (status: string) => string;
};

function BookingConfirmCard({
  booking,
  updateBookingStatus,
  getStatusBadgeClass
}:BookingConfirmCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <h3 className="text-lg font-semibold">{booking.title}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <UserIcon className="mr-1 h-4 w-4" />
            <span>{booking.firstName + booking.lastName}</span>
          </div>
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>{dayjs(booking.date).format("DD-MM-YYYY")}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="mr-1 h-4 w-4" />
            <span>{booking.start_time}</span>
            <span className="mx-2">•</span>
            <span>{booking.duration} hours</span>
          </div>
          {booking.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Notes:</p>
              <p>{booking.notes}</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="flex flex-col items-end justify-center">
            <div className="text-lg font-semibold">${booking.total_price}</div>
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusBadgeClass(booking.status)}`}
            >
              {booking.status}
            </span>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={() => updateBookingStatus(booking.id, "accepted")}
              className="flex items-center rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              <CheckIcon className="mr-1 h-4 w-4" />
              Accept
            </Button>
            <Button
              onClick={() => updateBookingStatus(booking.id, "cancelled")}
              className="flex items-center rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              <XIcon className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmCard;
