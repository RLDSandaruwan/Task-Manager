const Label = require("../models/labelModel");

// @desc    Create a new label
// @route   POST /api/labels
// @access  Public (you can make it private later if needed)
const createLabel = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Label name is required" });
    }

    // check if label already exists
    const existingLabel = await Label.findOne({ name });
    if (existingLabel) {
      return res.status(400).json({ message: "Label already exists" });
    }

    const newLabel = await Label.create({
      name,
      color: color || "#888888", // default color if not provided
    });

    res.status(201).json(newLabel);
  } catch (error) {
    console.error("Error creating label:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all labels
// @route   GET /api/labels
// @access  Public
const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find().sort({ createdAt: -1 });
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a label by ID
// @route   DELETE /api/labels/:id
// @access  Public
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

module.exports = {
  createLabel,
  getAllLabels,
  deleteLabel,
};
