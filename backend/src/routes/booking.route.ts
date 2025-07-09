import express from "express"
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { BookingController } from "../controllers/booking.controller";
const router  = express.Router();
const bookingController = new BookingController();

router.get(
  "/",
  authenticate,
  authorizeRoles("customer", "provider"),
  bookingController.getBookingByUserId
);
router.post("/",authenticate,authorizeRoles('customer'),bookingController.createBooking);
router.put(
  "/update",
  authenticate,
  authorizeRoles("provider", "customer"),
  bookingController.updateBooking
);

export default router;