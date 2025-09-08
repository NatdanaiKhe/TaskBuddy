import { useEffect, useState } from "react";
import BookingTable from "./BookingTable";
import BookingConfirmCard from "./BookingConfirmCard";
import type { BookingType } from "@/types/bookingTypes";
import bookingService from "@/api/bookingService";
import Loader from "./Loader";
import { toast, Toaster } from "sonner";
import { getStatusBadgeClass } from "@/types/bookingTypes";

function ProviderBooking() {
  const [pendingBookings, setPendingBookings] = useState<BookingType[]>();
  const [confirmedBookings, setConfirmedBookings] = useState<BookingType[]>();
  const [completedBookings, setCompletedBookings] = useState<BookingType[]>();
  // const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBooking();
      console.log(res.booking);

      if (res.booking) {
        // Filter bookings by status
        const pendingBookings = res.booking?.filter(
          (booking: BookingType) => booking.status === "pending",
        );
        const confirmedBookings = res.booking?.filter(
          (booking: BookingType) => booking.status === "accepted",
        );
        const completedBookings = res.booking?.filter(
          (booking: BookingType) =>
            booking.status === "completed" || booking.status == "cancelled",
        );
        setPendingBookings(pendingBookings);
        setConfirmedBookings(confirmedBookings);
        setCompletedBookings(completedBookings);
      }
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

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await bookingService.updateBookingStatus(bookingId, status);

      if (res.success) {
        toast.success("Update task status success");
        fetchBookings();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.success("Failed to update task status");
      }
    }
  };

  

  useEffect(() => {
    fetchBookings();
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    
    <div className="space-y-6">
      <Toaster />
      {/* Pending Bookings */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Pending Bookings
        </h2>
        {pendingBookings?.length == 0 || !pendingBookings ? (
          <p className="text-gray-500">No pending bookings at the moment.</p>
        ) : (
          <div className="space-y-4">
            {pendingBookings?.map((booking) => (
              <BookingConfirmCard
                key={booking.id}
                booking={booking}
                updateBookingStatus={updateBookingStatus}
                getStatusBadgeClass={getStatusBadgeClass}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Bookings */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Upcoming Bookings
        </h2>
        {confirmedBookings?.length == 0 || !confirmedBookings ? (
          <p className="text-gray-500">No upcoming bookings at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <BookingTable
              bookings={confirmedBookings}
              onAction={(id) => updateBookingStatus(id, "completed")}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Completed Bookings
        </h2>
        {completedBookings?.length == 0 || !completedBookings ? (
          <p className="text-gray-500">No completed bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <BookingTable
              bookings={completedBookings}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderBooking;
