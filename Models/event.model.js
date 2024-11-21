// Models/event.model.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
  availableSeats: [
    {
      seatNumber: {
        type: String,
        required: true,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

export default mongoose.model("Event", eventSchema);
