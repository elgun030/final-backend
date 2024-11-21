import ChoreographerEvent from "../Models/choreographerEvent.model.js";

export const createChoreographerEvent = async (req, res) => {
  try {
    const event = new ChoreographerEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllChoreographerEvents = async (req, res) => {
  try {
    const events = await ChoreographerEvent.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChoreographerEventById = async (req, res) => {
  try {
    const event = await ChoreographerEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editChoreographerEvent = async (req, res) => {
  try {
    const event = await ChoreographerEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!event) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteChoreographerEvent = async (req, res) => {
  try {
    const event = await ChoreographerEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "No events found." });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
