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
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mostWatched: { // En Çok İzlenen alanı eklendi
    type: Boolean,
    default: false, // Varsayılan değeri false
  },
});

export const Event = mongoose.model("Event", EventSchema);

export default Event;
