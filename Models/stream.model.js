import mongoose from "mongoose";

const StreamSchema = new mongoose.Schema({
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
  subtitle: {
    type: String,
    required: true,
  },
  mostWatched: {
    type: Boolean,
    default: false,
  },
});

export const Stream = mongoose.model("Stream", StreamSchema);

export default Stream;
