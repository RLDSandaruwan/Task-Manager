import { useEffect, useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingimg from "../assets/loader.gif";
import TaskListTopBar from "./TaskListTopBar";

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
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
        All Tasks
      </h2>

      {/* Floating Add Button */}
      <button
        onClick={openNewTaskForm}
        className="fixed bottom-8 right-8 bg-purpleMain hover:bg-purple-700 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-3xl transition"
      >
        +
      </button>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={closeFormModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h3>

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
      )}

      <hr className="border-gray-300 mb-4" />

      {isLoading ? (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No tasks found in this filter.
        </p>
      ) : (
        <div className="space-y-3">
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
    </div>
  );
};

export default TaskList;
