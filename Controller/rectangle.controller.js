import Rectangle from "../Models/rectangle.model.js";

export const getAllRectangles = async (req, res) => {
  try {
    const rectangles = await Rectangle.find();
    res.status(200).json(rectangles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rectangles", error });
  }
};

export const getSingleRectangle = async (req, res) => {
  const { id } = req.params;

  try {
    const rectangle = await Rectangle.findById(id);
    if (!rectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }
    res.status(200).json(rectangle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rectangle", error });
  }
};

export const createRectangle = async (req, res) => {
  const { name, image, video, title } = req.body;

  try {
    const newRectangle = new Rectangle({ name, image, video, title });
    await newRectangle.save();
    res.status(201).json(newRectangle);
  } catch (error) {
    res.status(500).json({ message: "Error creating rectangle", error });
  }
};

export const deleteRectangle = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRectangle = await Rectangle.findByIdAndDelete(id);
    if (!deletedRectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }
    res.status(200).json({ message: "Rectangle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rectangle", error });
  }
};

export const editRectangle = async (req, res) => {
  const { id } = req.params;
  const { name, image, video, title } = req.body;

  try {
    const updatedRectangle = await Rectangle.findByIdAndUpdate(
      id,
      { name, image, video, title },
      { new: true, runValidators: true }
    );
    if (!updatedRectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }
    res.status(200).json(updatedRectangle);
  } catch (error) {
    res.status(500).json({ message: "Error updating rectangle", error });
  }
};
