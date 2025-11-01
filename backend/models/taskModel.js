const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Task"],
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    dueDate: {
      type: Date, 
      required: false, 
    },
  },
  {
    timestamps: true, 
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
