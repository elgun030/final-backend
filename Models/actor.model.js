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
      required: true, // Resim URL'si için
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Cinsiyet seçenekleri
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true, // Doğum tarihi
    },
    nationality: {
      type: String,
      required: true, // Milliyet
    },
    films: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film", // Aktörün yer aldığı filmler
      },
    ],
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme tarihlerini otomatik ekler
  }
);

const Actor = mongoose.model("Actor", actorSchema);

export default Actor;
