import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  Image: {
    type: String,
    required: true,
  },
});

export const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
