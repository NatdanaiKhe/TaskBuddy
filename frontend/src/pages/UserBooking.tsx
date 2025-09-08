import bookingService from "@/api/bookingService";
import BookingConfirmCard from "@/components/BookingConfirmCard";
import BookingTable from "@/components/BookingTable";
import { getStatusBadgeClass, type BookingType } from "@/types/bookingTypes";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

function UserBooking() {
  const [pendingBookings, setPendingBookings] = useState<BookingType[]>();
  const [confirmedBookings, setConfirmedBookings] = useState<BookingType[]>();
  const [completedBookings, setCompletedBookings] = useState<BookingType[]>();
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

  useEffect(() => {
    fetchBookings();
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    <main className="h-auto min-h-[calc(100vh-64px)] flex-grow bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <Toaster />
          {/* Pending Bookings */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Pending Bookings
            </h2>
            {pendingBookings?.length == 0 || !pendingBookings ? (
              <p className="text-gray-500">
                No pending bookings at the moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <BookingTable
                  bookings={pendingBookings}
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
      </div>
    </main>
  );
}

export default UserBooking;
