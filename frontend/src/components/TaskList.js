import { useEffect, useState, useRef } from "react";
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
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);

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
      setTimeout(() => {
        setTasks(data);
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

  useEffect(() => {
    setCompletedTasks(tasks.filter((t) => t.completed));
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const isDueOnOrBeforeToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d <= today;
  };
  const overdueCount = tasks.filter((t) => !t.completed && isDueOnOrBeforeToday(t.dueDate)).length;

  // close dropdown when clicking outside / escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowFilterMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // ---------- FILTERED TASKS ----------
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    if (filter === "overdue") return !t.completed && isDueOnOrBeforeToday(t.dueDate);
    return true;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5" ref={filterMenuRef}>
        {/* Filter trigger */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(s => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm text-sm font-medium"
            aria-haspopup="true"
            aria-expanded={showFilterMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 01.894 1.447l-6.5 13A1 1 0 0113.5 18H10a1 1 0 01-.894-.553L3.106 5.447A1 1 0 013 4z" />
            </svg>
            <span className="text-gray-800">{
              filter === 'all' ? 'All Tasks' :
              filter === 'pending' ? 'Pending Tasks' :
              filter === 'overdue' ? 'Overdue Tasks' :
              'Completed Tasks'
            }</span>
            <span className="ml-2 inline-flex items-center justify-center bg-white text-xs text-gray-700 rounded-full px-2 py-0.5">
              {filter === 'all' ? totalTasks :
               filter === 'pending' ? pendingCount :
               filter === 'overdue' ? overdueCount :
               completedCount}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showFilterMenu && (
            <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-40">
              <ul className="py-1 text-sm">
                <li>
                  <button
                    onClick={() => { setFilter('all'); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-md ${filter === 'all' ? 'bg-purpleMain text-white' : 'hover:bg-gray-50'}`}
                  >
                    All Tasks <span className="float-right text-xs text-gray-600">{totalTasks}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setFilter('pending'); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-purpleMain text-white' : 'hover:bg-gray-50'}`}
                  >
                    Pending Tasks <span className="float-right text-xs text-gray-600">{pendingCount}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setFilter('overdue'); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-md ${filter === 'overdue' ? 'bg-purpleMain text-white' : 'hover:bg-gray-50'}`}
                  >
                    Overdue Tasks <span className="float-right text-xs text-gray-600">{overdueCount}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setFilter('completed'); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-purpleMain text-white' : 'hover:bg-gray-50'}`}
                  >
                    Completed Tasks <span className="float-right text-xs text-gray-600">{completedCount}</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between sm:justify-end gap-6 text-gray-700 text-sm">
          <p><b>Total:</b> {totalTasks}</p>
          <p><b>Completed:</b> {completedCount}</p>
          <p><b>Pending:</b> {pendingCount}</p>
        </div>
      </div>

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
