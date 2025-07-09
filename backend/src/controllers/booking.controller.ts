import { NextFunction, Request, Response } from "express";
import { CreateBookingDto } from "../types/bookingType";
import { BookingModel } from "../models/booking.model";
import { TaskModel } from "../models/task.model";

export class BookingController {
  createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req?.user?.id;
      const bookingData: CreateBookingDto = req.body;
      if (id) {
        bookingData.customer_id = id;
      }
      bookingData.date = bookingData.date.split("T")[0];

      // check task
      const task = await TaskModel.getTaskById(bookingData.task_id);
      if (!task) {
        res.status(200).json({ success: false, message: "Booking failed1" });
      }

      // set provider id via task
      bookingData.provider_id = task?.provider_id!;
      const bookingResult = await BookingModel.create(bookingData);
      console.log(bookingResult);

      if (!bookingResult) {
        res.status(200).json({ success: false, message: "Booking failed2" });
      }

      res
        .status(201)
        .json({ success: true, message: "Booking successfully", bookingData });
    } catch (error) {
      next(error);
    }
  };

  getBookingByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user_id = req.user?.id;
      const role = req.user?.role;
      let booking = null;

      if (role == "customer" && user_id) {
        booking = await BookingModel.findByCustomerId(user_id);
      } else if (role == "provider" && user_id) {
        booking = await BookingModel.findByProviderId(user_id);
      }

      if (!booking) {
        res.status(200).json({ success: false, message: "Booking not found" });
      }

      res.status(200).json({ success: true, booking: booking });
    } catch (error) {
      next(error);
    }
  };

  updateBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user_id = req.user?.id;
      const role = req.user?.role;
      const { bookingId, status } = req.body;
      let updateStatus = null

      const canUpdate =
        (role === "customer" && status === "cancelled") ||
        (role === "provider" && status);

      if (canUpdate) {
        updateStatus = await BookingModel.updateStatus(
          user_id!,
          bookingId,
          status,
          role
        );
      }

      if (!updateStatus) {
        res.status(200).json({ success: false, message: "Update failed" });
      }else{
        res.status(200).json({ success: true, message: "Update successfully" });
      }
      
    } catch (error) {
      next(error);
    }
  };
}
