import mongoose from "mongoose";
import Social from "../Models/social.model.js";

export const getAllSocials = async (req, res) => {
  try {
    const socials = await Social.find();
    res.status(200).json(socials);
  } catch (error) {
    console.error("Error in getAllSocials:", error);
    res.status(500).json({ message: "Error fetching social media links" });
  }
};

export const getSingleSocial = async (req, res) => {
  try {
    const socialId = req.params.id;
    const social = await Social.findById(socialId);

    if (!social) {
      return res.status(404).json({ message: "Social media link not found" });
    }

    res.status(200).json(social);
  } catch (error) {
    console.error("Error in getSingleSocial:", error);
    res.status(500).json({ message: "Error fetching social media link" });
  }
};

export const createSocial = async (req, res) => {
  try {
    const { name, icon, link } = req.body;

    if (!name || !icon || !link) {
      return res
        .status(400)
        .json({ message: "All fields (name, icon, link) are required" });
    }

    const newSocial = new Social({ name, icon, link });
    await newSocial.save();

    res.status(201).json({
      message: "Social media link created successfully",
      social: newSocial,
    });
  } catch (error) {
    console.error("Error in createSocial:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const editSocial = async (req, res) => {
  try {
    const socialId = req.params.id;
    const { name, icon, link } = req.body;

    // MongoDB ObjectId doğrulaması
    if (!mongoose.Types.ObjectId.isValid(socialId)) {
      return res
        .status(400)
        .json({ message: "Invalid social media link ID format" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (link !== undefined) updateData.link = link;

    const updatedSocial = await Social.findByIdAndUpdate(socialId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSocial) {
      return res.status(404).json({ message: "Social media link not found" });
    }

    res
      .status(200)
      .json({ message: "Social media link updated", social: updatedSocial });
  } catch (error) {
    console.error("Error updating social media link:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteSocial = async (req, res) => {
  try {
    const socialId = req.params.id;

    // MongoDB ObjectId doğrulaması
    if (!mongoose.Types.ObjectId.isValid(socialId)) {
      return res
        .status(400)
        .json({ message: "Invalid social media link ID format" });
    }

    const deletedSocial = await Social.findByIdAndDelete(socialId);

    if (!deletedSocial) {
      return res.status(404).json({ message: "Social media link not found" });
    }

    res.status(200).json({
      message: "Social media link deleted successfully",
      social: deletedSocial,
    });
  } catch (error) {
    console.error("Error deleting social media link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
