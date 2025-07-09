import axios from "./axios";
import type { BookingForm } from "../types/bookingTypes";

const bookingService = {
  booking: async (data: BookingForm) => {
    const res = await axios.post(
      "/booking/",
      data,
      { withCredentials: true },
    );
    return res.data;
  },
  getBooking: async () =>{
    const res = await axios.get("/booking/",
      {withCredentials: true}
    )
    return res.data
  },
  updateBookingStatus: async(bookingId:string,status:string)=>{
    const res = await axios.put("/booking/update",
      {bookingId,status},
      {withCredentials: true}
    )
    return res.data
  }
};

export default bookingService;
