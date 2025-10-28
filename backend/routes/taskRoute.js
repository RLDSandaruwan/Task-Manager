const express = require("express")
const Task = require("../models/taskModel")
const {createTask,getAllTasks,getTask,deleteTask, updateTask} = require("../controllers/taskController")
const router = express.Router()



//create a task 
router.post("/",createTask);

// get Data
router.get("/",getAllTasks)

//get single task
router.get("/:id",getTask)

//delete task
router.delete("/:id",deleteTask)

//update task
router.put("/:id",updateTask)


module.exports = router