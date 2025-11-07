const express = require("express");
const {
  createLabel,
  getAllLabels,
  deleteLabel,
} = require("../controllers/labelController");

const router = express.Router();

// Create a label (linked to a specific user)
router.post("/", createLabel);

// Get all labels for a user (based on query param ?userId=)
router.get("/", getAllLabels);

// Delete a label by ID
router.delete("/:id", deleteLabel);

module.exports = router;
