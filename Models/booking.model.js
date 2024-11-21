// Models/booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  eventId: {
    type: mongoose.Types.ObjectId,
    ref: "Event", 
    required: true,
  },
  seatNumber: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ["booked", "pending", "cancelled"], 
    default: "pending", 
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, 
  },
});

export default mongoose.model("Booking", bookingSchema);
