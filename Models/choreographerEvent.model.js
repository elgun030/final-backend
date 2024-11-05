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
    type: Date,  // Tarih alanı
    required: true,
  },
  image: {
    type: String, // Etkinliğe ait görselin URL'si
    required: true,
  },
  choreographer: {
    type: String, // Koreografın adı
    required: true,
  },
  gender: {
    type: String, // Koreografın cinsiyeti
    enum: ["Male", "Female",], // Geçerli cinsiyet seçenekleri
    required: true,
  },
});

const ChoreographerEvent = mongoose.model("ChoreographerEvent", choreographerEventSchema);

export default ChoreographerEvent;
