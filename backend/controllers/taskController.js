const Task = require("../models/taskModel");
const Label = require("../models/labelModel");
const User = require("../models/userModel");

// Create Task
const createTask = async (req, res) => {
try {
    const { name, completed, dueDate, labels, userId } = req.body;

    if (!name) return res.status(400).json({ msg: "Task name is required" });
    if (!userId) return res.status(400).json({ msg: "User ID is required" });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ msg: "User not found" });

    if (labels?.length) {
      const existingLabels = await Label.find({ _id: { $in: labels } });
      if (existingLabels.length !== labels.length) {
        return res.status(400).json({ msg: "Invalid label(s)" });
      }
    }

    const task = await Task.create({
      name,
      completed: completed || false,
      dueDate: dueDate || new Date(),
      labels: labels || [],
      user: userId,
    });

    const populated = await task.populate("labels");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ msg: error.message });
  }
};

//getUserTasks
const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ msg: "User ID is required" });

    const tasks = await Task.find({ user: userId }).populate("labels");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
  getUserTasks,
  getTask,
  deleteTask,
  updateTask,
};
