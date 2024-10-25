import Ticket from "../Models/ticket.model.js";
import mongoose from "mongoose";

export const createTicket = async (req, res) => {
  try {
    const { name, seat, location, time, date } = req.body;

    if (!name || !seat || !location || !time || !date) {
      return res.status(400).json({
        message: "All fields (name, seat, location, time, date) are required",
      });
    }

    const newTicket = new Ticket({
      name,
      seat,
      location,
      time,
      date,
    });

    await newTicket.save();

    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error("Error in createTicket:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error in getTickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID format" });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error in getTicketById:", error);
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { name, seat, location, time, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID format" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (seat !== undefined) updateData.seat = seat;
    if (location !== undefined) updateData.location = location;
    if (time !== undefined) updateData.time = time;
    if (date !== undefined) updateData.date = date;

    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res
      .status(200)
      .json({ message: "Ticket updated successfully", ticket: updatedTicket });
  } catch (error) {
    console.error("Error in updateTicket:", error);
    // Mongoose validation hatalarını yakalama
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Error updating ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID format" });
    }

    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    res.status(500).json({ message: "Error deleting ticket" });
  }
};
