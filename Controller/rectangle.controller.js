import Rectangle from "../Models/rectangle.model.js"; // Modelin doğru yolu
import mongoose from "mongoose";

// Tüm rectangle'ları getirir
export const getAllRectangles = async (req, res) => {
  try {
    const rectangles = await Rectangle.find();
    res.status(200).json(rectangles);
  } catch (error) {
    console.error("Error in getAllRectangles:", error);
    res.status(500).json({ message: "Error fetching rectangles" });
  }
};

// Tek bir rectangle'ı getirir
export const getSingleRectangle = async (req, res) => {
  try {
    const rectangleId = req.params.id;
    const rectangle = await Rectangle.findById(rectangleId);

    if (!rectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }

    res.status(200).json(rectangle);
  } catch (error) {
    console.error("Error in getSingleRectangle:", error);
    res.status(500).json({ message: "Error fetching rectangle" });
  }
};

// Yeni bir rectangle oluşturur
export const createRectangle = async (req, res) => {
  try {
    const { name, date, image, video, title } = req.body;

    if (!name || !date || !image || !video || !title) {
      return res.status(400).json({
        message: "All fields (name, date, image, video, title) are required",
      });
    }

    const newRectangle = new Rectangle({
      name,
      date,
      image,
      video,
      title,
    });

    await newRectangle.save();
    res
      .status(201)
      .json({
        message: "Rectangle created successfully",
        rectangle: newRectangle,
      });
  } catch (error) {
    console.error("Error in createRectangle:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mevcut rectangle'ı günceller
export const editRectangle = async (req, res) => {
  try {
    const rectangleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(rectangleId)) {
      return res.status(400).json({ message: "Invalid rectangle ID format" });
    }

    const { name, date, image, video, title } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (date !== undefined) updateData.date = date;
    if (image !== undefined) updateData.image = image;
    if (video !== undefined) updateData.video = video;
    if (title !== undefined) updateData.title = title;

    const updatedRectangle = await Rectangle.findByIdAndUpdate(
      rectangleId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }

    return res
      .status(200)
      .json({
        message: "Rectangle updated successfully",
        rectangle: updatedRectangle,
      });
  } catch (error) {
    console.error("Error updating rectangle:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Mevcut rectangle'ı siler
export const deleteRectangle = async (req, res) => {
  try {
    const rectangleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(rectangleId)) {
      return res.status(400).json({ message: "Invalid rectangle ID format" });
    }

    const deletedRectangle = await Rectangle.findByIdAndDelete(rectangleId);

    if (!deletedRectangle) {
      return res.status(404).json({ message: "Rectangle not found" });
    }

    res.status(200).json({ message: "Rectangle deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRectangle:", error);
    res.status(500).json({ message: "Server error" });
  }
};
