import Event from "../Models/events.model.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error in getSingleEvent:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, category, image, date, description, price, mostWatched } = req.body;

    if (!name || !category || !image || !date || !description || !price) {
      return res.status(400).json({
        message:
          "All fields (name, category, image, date, description, price) are required",
      });
    }

    const newEvent = new Event({
      name,
      category,
      image,
      date,
      description,
      price,
      mostWatched: mostWatched || 0, // Varsayılan olarak 0
    });
    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error in createEvent:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
  }
};

export const editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, category, image, date, description, price, mostWatched } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (date !== undefined) updateData.date = date;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (mostWatched !== undefined) updateData.mostWatched = mostWatched; // mostWatched alanını güncelle

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500).json({ message: "Server error" });
  }
};
