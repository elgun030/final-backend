import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mostWatched: { 
    type: Boolean,
    default: false,
  },
});

export const Event = mongoose.model("Event", EventSchema);

export default Event;
