const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  dueDate: { type: Date, default: Date.now },
  labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});

module.exports = mongoose.model("Task", taskSchema);
