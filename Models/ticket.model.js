import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: String,
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  limit: Number,
  price: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  remaining: Number,
  status: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Event ile ilişkilendirme
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
