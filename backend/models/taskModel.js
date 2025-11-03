const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Task"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
