import Actor from "../Models/actor.model.js";

export const createActor = async (req, res) => {
  try {
    const actor = new Actor(req.body);
    await actor.save();
    res.status(201).json(actor);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "An error occurred while creating the actor.",
        error: error.message,
      });
  }
};

export const getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.status(200).json(actors);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while importing actors.",
        error: error.message,
      });
  }
};

export const getActorById = async (req, res) => {
  const { id } = req.params;
  try {
    const actor = await Actor.findById(id);
    if (!actor) {
      return res.status(404).json({ message: "No actor found." });
    }
    res.status(200).json(actor);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while importing the actor.",
        error: error.message,
      });
  }
};

export const updateActor = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedActor = await Actor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedActor) {
      return res.status(404).json({ message: "No actor found." });
    }
    res.status(200).json(updatedActor);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "An error occurred while updating the actor.",
        error: error.message,
      });
  }
};

export const deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedActor = await Actor.findByIdAndDelete(id);
    if (!deletedActor) {
      return res.status(404).json({ message: "No actor found." });
    }
    res.status(200).json({ message: "The actor was deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the actor.",
        error: error.message,
      });
  }
};
