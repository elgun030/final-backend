import Event from "../Models/event.model.js";

export const addEvent = async (req, res) => {
  const { name, image, date, price, availableSeats } = req.body;

  if (!name || !image || !date || !price || !availableSeats) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    return res.status(400).json({ message: "Price must be a valid number" });
  }

  try {
    const newEvent = new Event({
      name,
      image,
      date,
      price: parsedPrice,
      availableSeats,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding event", error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params; // URL'den ID al

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event deleted successfully", event: deletedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};
