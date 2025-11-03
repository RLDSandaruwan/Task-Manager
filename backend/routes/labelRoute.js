const express = require("express");
const {
  createLabel,
  getAllLabels,
  deleteLabel,
} = require("../controllers/labelController");

const router = express.Router();

// Create a label
router.post("/", createLabel);

// Get all labels
router.get("/", getAllLabels);

// Delete a label
router.delete("/:id", deleteLabel);

module.exports = router;
