import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";
import TaskListTopBar from "./TaskListTopBar";
import { FaPlus } from "react-icons/fa";

const TaskList = () => {
  const [formData, setformData] = useState({
    name: "",
    dueDate: "",
    completed: false,
    labels: [],
  });

  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [filter, setFilter] = useState("all");
  

  const openNewTaskForm = () => {
    setformData({ name: "", dueDate: "", completed: false, labels: [] });
    setisEditing(false);
    setShowFormModal(true);
  };

  const closeFormModal = () => setShowFormModal(false);

  const { name, dueDate } = formData;

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    if (!user?._id) return toast.error("User not logged in");
    setisLoading(true);

    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);
      // Filter out completed tasks - only show incomplete (today and upcoming)
      const incompleteTasks = data.filter((task) => !task.completed);
      setTimeout(() => {
        setTasks(incompleteTasks);
        setisLoading(false);
      }, 600);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
      setisLoading(false);
    }
  };

  const getLabels = async () => {
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

  const createTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Task name is required");
    if (!user?._id) return toast.error("User not logged in");

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

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted successfully");
      getTasks();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Task name is required");

    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      toast.success("Task updated successfully");
      setformData({ name: "", dueDate: "", completed: false, labels: [] });
      setisEditing(false);
      getTasks();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
    }
  };

  const setToComplete = async (task) => {
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, {
        ...task,
        completed: true,
      });
      toast.success("Task marked as completed");
      getTasks();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
    }
  };

  const getSingleTask = (task) => {
    setformData({
      name: task.name,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      completed: task.completed,
      labels: task.labels?.map((l) => l._id) || [],
    });
    setTaskID(task._id);
    setisEditing(true);
    setShowFormModal(true);
  };

  const totalTasks = tasks.length;
  const pendingCount = tasks.length; // all tasks shown are pending (incomplete)
  
  const isDueOnOrBeforeToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d <= today;
  };

  const isDueToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d < today; // strictly before today
  }).length;

  const todayCount = tasks.filter((t) => isDueToday(t.dueDate)).length;

  

  // ---------- FILTERED TASKS ----------
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return true; // all tasks are pending
    if (filter === "today") return isDueToday(t.dueDate);
    if (filter === "overdue") {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      const today = new Date();
      d.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return d < today; // strictly before today
    }
    return true; // "all" shows all incomplete tasks
  });

  return (
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">All Tasks</h1>
        <div className="flex items-center gap-2 text-sm text-todoist-textLight">
          <span>{totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}</span>
        </div>
      </div>

      {/* TOP BAR WITH FILTER (LEFT) AND STATS (RIGHT) */}
      <TaskListTopBar
        filter={filter}
        setFilter={setFilter}
        totalTasks={totalTasks}
        pendingCount={pendingCount}
        todayCount={todayCount}
        overdueCount={overdueCount}
      />

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

      {isLoading ? (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-todoist-textLight text-sm mb-4">No tasks to show</p>
          <p className="text-xs text-gray-400">All your tasks are organized and up to date.</p>
        </div>
      ) : (
        <div className="space-y-1 mt-4">
          {filteredTasks
            .slice()
            .reverse()
            .map((task, index) => (
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
};

export default TaskList;
