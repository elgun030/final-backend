import express from "express";
import {
  bookSeat,
  getUserBookings,
  getBookingsByUserId,
  deleteBooking,
} from "../Controller/booking.controller.js";

const router = express.Router();

router.post("/book", bookSeat);

router.get("/:userId/bookings", getUserBookings);

router.get("/:userId", getBookingsByUserId);

router.delete("/:userId/bookings/:bookingId", deleteBooking);

export default router;
