import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }], // Masa ile ilişkilendirilen biletler
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;
