const Task = require("../models/taskModel");
const Label = require("../models/labelModel");

// Create Task
const createTask = async (req, res) => {
  try {
    const { name, completed, dueDate, labels } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Task name is required" });
    }

    // Optional: Validate that all provided label IDs exist
    if (labels && labels.length > 0) {
      const existingLabels = await Label.find({ _id: { $in: labels } });
      if (existingLabels.length !== labels.length) {
        return res.status(400).json({ msg: "One or more labels not found" });
      }
    }

    const task = await Task.create({
      name,
      completed: completed || false,
      dueDate: dueDate || new Date(),
      labels: labels || [],
    });

    const populatedTask = await task.populate("labels");
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    // Populate label details when fetching tasks
    const tasks = await Task.find().populate("labels");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get Single Task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("labels");

    if (!task) {
      return res.status(404).json({ msg: "No task found with this ID" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ msg: "No task found with this ID" });
    }
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("labels");

    if (!task) {
      return res.status(404).json({ msg: "No task found with this ID" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
};
