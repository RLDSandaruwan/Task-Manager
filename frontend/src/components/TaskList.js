import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif"

//http://localhost:5000/api/tasks

const TaskList = () => {

  const [formData, setformData] = useState({
    name: "",
    completed: false,

  })
  const [Tasks, setTasks] = useState([])
  const [CompletedTask, setcompletedTask] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isEditing, setisEditing] = useState(false)
  const [TaskID, setTaskID] = useState("")

  const { name } = formData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setformData({ ...formData, [name]: value })
  };

  const getTasks = async () => {
    setisLoading(true)
    try {
      const { data } = await axios.get(`${URL}/api/tasks`)
      // simulate loading delay (2 seconds)
      setTimeout(() => {
        setTasks(data);
        setisLoading(false);
      }, 2000);
    }
    catch (err) {
      toast.error(err.message)
      setisLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])


  const createTask = async (e) => {
    e.preventDefault()
    if (name == "") {
      return toast.error("input field cannot be empty")
    }
    try {
      const res = await axios.post(`${URL}/api/tasks`, formData);
      if (res.status === 201) {
        toast.success("Task added successfully");
        setformData({ ...formData, name: "" });
        getTasks()
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`, formData);
      toast.success("Task deleted successfully");
      getTasks()
    }
    catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    const cTask = Tasks.filter((task) => {
        return task.completed === true
  })
  setcompletedTask(cTask)
  }, [Tasks])
  

  const getSingleTask = async (task) => {
    setformData({ name: task.name, completed: false })
    setTaskID(task._id)
    setisEditing(true)
  }

  const updateTask = async (e) => {
    e.preventDefault()
    if (name == "") {
      return toast.error("input field cannot be empty")
    }
    try {
      await axios.put(`${URL}/api/tasks/${TaskID}`, formData);
      setformData({ ...formData, name: "" });
      setisEditing(false)
      toast.success("Task update successfully");
      getTasks()
    }
    catch (err) {
      toast.error(err.message)
    }
  }

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      toast.success("Task marked as completed");
      getTasks()
    }
    catch (err) {
      toast.error(err.message)
    }
  }






  return (
    <div >
      <h2>Task Manager</h2>
      <TaskForm

        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}

      />

      {Tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {Tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {CompletedTask.length}
          </p>
        </div>
      )}

      <hr />

      {
        isLoading && (
          <div className="--flex-center">
            <img src={loadingimg} alt="Loading" />
          </div>
        )
      }

      {!isLoading && Tasks.length === 0 ? (
        <p>No tasks found.please add tasks</p>
      ) : (
        Tasks.map((task, index) => (
          <Task

            key={task._id || index}
            task={task}
            index={index}
            deleteTask={deleteTask}
            getSingleTask={getSingleTask}
            setToComplete={setToComplete}

          />
        ))
      )}


    </div>
  )
}

export default TaskList;