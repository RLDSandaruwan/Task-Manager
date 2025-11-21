import React from "react";
import { useEffect, useState } from "react";
import CompletedTaskItem from "./CompletedTaskItem";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";

function Completed() {

  const [formData, setformData] = useState({
    name: "",
    dueDate: "",
    completed: false,
  });

  const [Tasks, setTasks] = useState([]);
  const [CompletedTask, setcompletedTask] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [TaskID, setTaskID] = useState("");

  const { name, dueDate } = formData;

    // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };


  // fetch Completed tasks
  const getCompletedTasks = async () => {
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);
      // Filter only completed ones
      const completed = data.filter((task) => task.completed === true);
      setTimeout(() => {
        setTasks(completed);
        setisLoading(false);
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getCompletedTasks();
  }, []);


  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted successfully");
      getCompletedTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // count completed tasks
  useEffect(() => {
    const cTask = Tasks.filter((task) => task.completed === true);
    setcompletedTask(cTask);
  }, [Tasks]);

  
  // get single task for editing
  const getSingleTask = (task) => {
    setformData({
      name: task.name,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "", // format date
      completed: task.completed,
    });
    setTaskID(task._id);
    setisEditing(true);
  };


  // mark as complete
  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      dueDate: task.dueDate,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      toast.success("Task marked as completed");
      getCompletedTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">Completed</h1>
        <p className="text-sm text-todoist-textLight">
          {Tasks.length} {Tasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      )}

      {!isLoading && Tasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-todoist-textLight mb-1">No completed tasks yet</p>
          <p className="text-sm text-todoist-textLight">Tasks you complete will appear here</p>
        </div>
      ) : (
        <div className="p-3">
          {Tasks.slice().reverse().map((task, index) => (
            <CompletedTaskItem
              key={task._id || index}
              task={task}
              index={index}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Completed;
