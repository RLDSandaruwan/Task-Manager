import React from "react";
import { useEffect, useState } from "react";
import TodayTaskItem from "./TodayTaskItem";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";
import { FaPlus } from "react-icons/fa";

function Today() {

  const [formData, setformData] = useState({
    name: "",
    dueDate: "",
    completed: false,
    labels: [],
  });

  const [Tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [CompletedTask, setcompletedTask] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [TaskID, setTaskID] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);

  const openNewTaskForm = () => {
    setformData({ name: "", dueDate: "", completed: false, labels: [] });
    setisEditing(false);
    setShowFormModal(true);
  };

  const closeFormModal = () => setShowFormModal(false);

  const { name, dueDate } = formData;

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // fetch today tasks for user
  const getTasks = async () => {
    if (!user?._id) return toast.error("User not logged in");
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTasks = data.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

      setTimeout(() => {
        setTasks(todayTasks);
        setisLoading(false);
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
      setisLoading(false);
    }
  };

  // fetch all labels for logged user
  const getLabels = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return toast.error("User not logged in");

    try {
      const { data } = await axios.get(`${URL}/api/labels?userId=${user._id}`);
      setLabels(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load labels");
    }
  };

  useEffect(() => {
    getTasks();
    getLabels();
  }, []);

  //  create task linked to user
  const createTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Task name is required");
    if (!user?._id) return toast.error("User not logged in");

    // Auto-set today's date if no due date
    const today = new Date().toISOString().split("T")[0];
    const dataToSend = {
      ...formData,
      dueDate: dueDate || today,
      userId: user._id,
    };

    try {
      const res = await axios.post(`${URL}/api/tasks`, dataToSend);
      if (res.status === 201) {
        toast.success("Task added successfully!");
        setformData({ name: "", dueDate: "", completed: false, labels: [] });
        getTasks();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
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
      labels: task.labels?.map((l) => l._id) || [],
    });
    setTaskID(task._id);
    setisEditing(true);
    setShowFormModal(true);
  };

  // update task
  const updateTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${TaskID}`, formData);
      setformData({ name: "", dueDate: "", completed: false, labels: [] });
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
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">Today</h1>
        <div className="flex items-center gap-2 text-sm text-todoist-textLight">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          {Tasks.length > 0 && (
            <><span>·</span><span>{Tasks.length} {Tasks.length === 1 ? 'task' : 'tasks'}</span></>
          )}
        </div>
      </div>
      
      {/* Task Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start sm:items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative my-8 sm:my-0 animate-slideUp">
            {/* Close button */}
            <button
              onClick={closeFormModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-todoist-text">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <TaskForm
                name={name}
                dueDate={dueDate}
                labels={formData.labels}
                allLabels={labels}
                handleInputChange={handleInputChange}
                createTask={(e) => {
                  createTask(e);
                  closeFormModal();
                }}
                isEditing={isEditing}
                updateTask={(e) => {
                  updateTask(e);
                  closeFormModal();
                }}
                setformData={setformData}
              />
            </div>
          </div>
        </div>
      )}


      {/* Overdue Section */}
      {Tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        const today = new Date();
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
      }).length > 0 && (
        <div className="mb-6">
          <button className="flex items-center gap-2 text-sm font-semibold text-todoist-text mb-3 hover:text-gray-600 transition-colors">
            <span>▼</span>
            <span>Overdue</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      )}

      {!isLoading && Tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-todoist-textLight text-sm mb-4">Your peace of mind is priceless</p>
          <p className="text-xs text-gray-400">No tasks scheduled for today. Enjoy the clear slate!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {Tasks.slice().reverse().map((task, index) => (
            <TodayTaskItem
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

      {/* Add Task Button */}
      <button
        onClick={openNewTaskForm}
        className="flex items-center gap-2 text-todoist-textLight hover:text-todoist-red text-sm mt-4 py-2 px-1 hover:bg-gray-50 rounded transition-colors w-full"
      >
        <FaPlus className="text-todoist-red text-xs" />
        <span>Add task</span>
      </button>
    </div>
  );
}

export default Today;
