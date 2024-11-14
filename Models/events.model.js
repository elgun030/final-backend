import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  date: Date,
  description: String,
  mostWatched: Boolean,
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
});

export const Event = mongoose.model("Event", EventSchema);

export default Event;
