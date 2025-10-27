const Task = require("../models/taskModel")

//create task
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(200).json(task)
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//get single task
const getTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json(`No tasks with this id`)
        }
        res.status(200).json(task)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//delete task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).json(`No tasks with this id`)
        }
        res.status(200).send("Task Deleted")
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// Update Task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findByIdAndUpdate(
            {_id:id},req.body,{new:true},{runValidators:true},
        )
        if (!task) {
            return res.status(404).json(`No tasks with this id`)
        }
        res.status(200).json(task)
    }
    catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//patch for update not all data in json

module.exports = {
    createTask,
    getAllTasks,
    getTask,
    deleteTask,
    updateTask
}