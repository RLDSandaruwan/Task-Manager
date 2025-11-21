import React from "react";
import { useEffect, useState } from "react";
import TodayTaskItem from "./TodayTaskItem";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";
import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";

function Completed() {

  const [formData, setformData] = useState({
    name: "",
    dueDate: "",
    completed: false,
    labels: [],
  });

  const [Tasks, setTasks] = useState([]);
  const [CompletedTask, setcompletedTask] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [TaskID, setTaskID] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [labels, setLabels] = useState([]);

  const { name, dueDate } = formData;

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // fetch Upcoming (not completed & future date) tasks
  const getUpcomingTasks = async () => {
    if (!user?._id) return toast.error("User not logged in");
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter tasks with due date in the future AND not completed
      const upcoming = data.filter((task) => {
        if (!task.dueDate) return false; // skip tasks without date
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate > today && !task.completed;
      });

      setTimeout(() => {
        setTasks(upcoming);
        setisLoading(false);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
      setisLoading(false);
    }
  };


  // Fetch all labels for logged user
  const getLabels = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(`${URL}/api/labels?userId=${user._id}`);
      setLabels(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load labels");
    }
  };

  useEffect(() => {
    getUpcomingTasks();
    getLabels();
  }, []);

  // // create task


  // const createTask = async (e) => {
  //   e.preventDefault();
  //   if (name.trim() === "") {
  //     return toast.error("Input field cannot be empty");
  //   }

  //   // Auto-set today's date if no due date
  //   const today = new Date().toISOString().split("T")[0];
  //   const dataToSend = {
  //     ...formData,
  //     dueDate: formData.dueDate || today,
  //   };

  //   try {
  //     const res = await axios.post(`${URL}/api/tasks`, dataToSend);
  //     if (res.status === 201) {
  //       toast.success("Task added successfully!");
  //       setformData({ name: "", dueDate: "", completed: false });
  //       getUpcomingTasks();
  //     }
  //   } catch (err) {
  //     toast.error(err.message);
  //   }
  // };


  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted successfully");
      getUpcomingTasks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // // count completed tasks

  // useEffect(() => {
  //   const cTask = Tasks.filter((task) => task.completed === true);
  //   setcompletedTask(cTask);
  // }, [Tasks]);

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
      setShowFormModal(false);
      toast.success("Task updated successfully");
      getUpcomingTasks();
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
      getUpcomingTasks();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
    }
  };



  return (
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">Upcoming</h1>
        <p className="text-sm text-todoist-textLight">
          {Tasks.length} {Tasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* Task Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start sm:items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative my-8 sm:my-0 animate-slideUp">
            {/* Close button */}
            <button
              onClick={() => setShowFormModal(false)}
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
                  // createTask(e);
                  // closeFormModal();
                }}
                isEditing={isEditing}
                updateTask={(e) => {
                  updateTask(e);
                }}
                setformData={setformData}
              />
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      )}

      {!isLoading && Tasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-todoist-textLight mb-1">No upcoming tasks</p>
          <p className="text-sm text-todoist-textLight">Tasks with future dates will appear here</p>
        </div>
      ) : (
        <div className="p-3">
          {Tasks.slice().reverse().map((task, index) => {
            // Format due date
            let formattedDate = "No date";
            if (task.dueDate) {
              const dueDate = new Date(task.dueDate);
              const today = new Date();
              dueDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);
              const diffInDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
              if (diffInDays === 0) formattedDate = "Due Today";
              else if (diffInDays === -1) formattedDate = "Yesterday";
              else if (diffInDays === 1) formattedDate = "Tomorrow";
              else if (diffInDays < -1)
                formattedDate = `Overdue: ${dueDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}`;
              else
                formattedDate = dueDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
            }
            // Normalize labels
            const labelList = Array.isArray(task.labels)
              ? task.labels
              : typeof task.labels === "string"
                ? task.labels.split(",").map((l) => l.trim())
                : [];
            return (
              <div key={task._id || index} className="group flex items-start gap-3 py-2 px-1 hover:bg-gray-50 rounded transition-colors border-b border-gray-100 last:border-0">
                {/* Checkbox */}
                <button
                  onClick={() => setToComplete(task)}
                  className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center flex-shrink-0 transition-colors"
                  title="Mark as Complete"
                >
                </button>
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-todoist-text mb-1">{task.name}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {formattedDate !== "No date" && (
                      <span
                        className={`flex items-center gap-1 ${formattedDate.includes("Today")
                            ? "text-green-600"
                            : formattedDate.includes("Overdue")
                              ? "text-todoist-red font-medium"
                              : "text-todoist-textLight"
                          }`}
                      >
                        {formattedDate}
                      </span>
                    )}
                    {labelList.map((label, i) => {
                      const labelName = label.name || label;
                      const labelColor = label.color || "#808080";
                      return (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{
                            color: labelColor,
                            backgroundColor: `${labelColor}15`,
                            borderColor: `${labelColor}40`,
                            borderWidth: '1px',
                          }}
                        >
                          #{labelName}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Actions - Hidden until hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                  <button
                    onClick={() => getSingleTask(task)}
                    className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    title="Edit Task"
                  >
                    <FaRegEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-gray-400 hover:text-todoist-red p-1 transition-colors"
                    title="Delete Task"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Completed;
