import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String, 
    required: true,
  },
  link: {
    type: String, 
    required: true,
  }
});

export const Social = mongoose.model("Social", SocialSchema);

export default Social;
