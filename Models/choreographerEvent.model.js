import mongoose from "mongoose";

const choreographerEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  choreographer: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
});

const ChoreographerEvent = mongoose.model(
  "ChoreographerEvent",
  choreographerEventSchema
);

export default ChoreographerEvent;
