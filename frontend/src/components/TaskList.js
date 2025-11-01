import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";

const TaskList = () => {
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

  // handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // fetch tasks
  const getTasks = async () => {
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTimeout(() => {
        setTasks(data);
        setisLoading(false);
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // create task
  const createTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      return toast.error("Input field cannot be empty");
    }

    // Auto-set today's date if no due date
    const today = new Date().toISOString().split("T")[0];
    const dataToSend = {
      ...formData,
      dueDate: formData.dueDate || today,
    };

    try {
      const res = await axios.post(`${URL}/api/tasks`, dataToSend);
      if (res.status === 201) {
        toast.success("Task added successfully!");
        setformData({ name: "", dueDate: "", completed: false });
        getTasks();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };


  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted successfully");
      getTasks();
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

  // update task
  const updateTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${TaskID}`, formData);
      setformData({ name: "", dueDate: "", completed: false });
      setisEditing(false);
      toast.success("Task updated successfully");
      getTasks();
    } catch (err) {
      toast.error(err.message);
    }
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
      getTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
        All Tasks
      </h2>

      <TaskForm
        name={name}
        dueDate={dueDate}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />

      {Tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6 mb-4 text-gray-700">
          <p>
            <b>Total Tasks:</b> {Tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {CompletedTask.length}
          </p>
        </div>
      )}

      <hr className="border-gray-300 my-4" />

      {isLoading && (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      )}

      {!isLoading && Tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No tasks found. Please add some tasks.
        </p>
      ) : (
        <div className="space-y-3">
          {Tasks.slice().reverse().map((task, index) => (
            <Task
              key={task._id || index}
              task={task}
              index={index}
              deleteTask={deleteTask}
              getSingleTask={getSingleTask}
              setToComplete={setToComplete}
            />
          ))}
        </div>
      )}
    </div>
  );

};

export default TaskList;
