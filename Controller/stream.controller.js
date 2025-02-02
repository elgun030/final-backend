import Stream from "../Models/stream.model.js";

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error });
  }
};

export const getSingleStream = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: "Stream not found." });
    }
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const createStream = async (req, res) => {
  const { name, category, image, date, subtitle, mostWatched } = req.body;

  const newStream = new Stream({
    name,
    category,
    image,
    date,
    subtitle,
    mostWatched,
  });

  try {
    const savedStream = await newStream.save();
    res.status(201).json(savedStream);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const editStream = async (req, res) => {
  try {
    const updatedStream = await Stream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStream) {
      return res.status(404).json({ message: "Stream not found." });
    }
    res.status(200).json(updatedStream);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const deleteStream = async (req, res) => {
  try {
    const deletedStream = await Stream.findByIdAndDelete(req.params.id);
    if (!deletedStream) {
      return res.status(404).json({ message: "Stream not found." });
    }
    res.status(200).json({ message: "Stream deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
