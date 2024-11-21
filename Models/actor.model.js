import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    biography: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], 
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true, 
    },
    nationality: {
      type: String,
      required: true, 
    },
    films: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film", 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Actor = mongoose.model("Actor", actorSchema);

export default Actor;
