import mongoose from "mongoose";

const newsSectionSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle:{
        type: String,
        required: true,
    }
})

export const NewsSection = mongoose.model("NewsSection", newsSectionSchema);

export default NewsSection;