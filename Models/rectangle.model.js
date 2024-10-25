import mongoose from "mongoose";

const rectangleSchema = new mongoose.Schema({
  name: {
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
  video: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export const Rectangle = mongoose.model("Rectangle", rectangleSchema);

export default Rectangle;

// AddRectangles
