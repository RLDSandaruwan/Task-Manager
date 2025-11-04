const Label = require("../models/labelModel");

// @desc    Create a new label
// @route   POST /api/labels
const createLabel = async (req, res) => {
  try {
    const { name, color, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Label name is required" });
    }

    // Check if user already has this label name
    const existingLabel = await Label.findOne({ name, userId });
    if (existingLabel) {
      return res.status(400).json({ message: "Label already exists for this user" });
    }

    const newLabel = await Label.create({
      name,
      color: color || "#888888",
      userId,
    });

    res.status(201).json(newLabel);
  } catch (error) {
    console.error("Error creating label:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all labels for a user
// @route   GET /api/labels?userId=123
const getAllLabels = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const labels = await Label.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a label by ID
const deleteLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const label = await Label.findById(id);

    if (!label) {
      return res.status(404).json({ message: "Label not found" });
    }

    await label.deleteOne();
    res.status(200).json({ message: "Label deleted successfully" });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createLabel, getAllLabels, deleteLabel };
