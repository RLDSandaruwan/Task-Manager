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
    labels: [],
  });

  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
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

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  // fetch tasks for this user
  const getTasks = async () => {
    if (!user?._id) return toast.error("User not logged in");
    setisLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);
      setTimeout(() => {
        setTasks(data);
        setisLoading(false);
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
      setisLoading(false);
    }
  };

  // Fetch labels for the logged-in user only
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
      toast.error(err.response?.data?.msg || err.message);
    }
  };

  // update task
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

  // mark as complete
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

  // get single task for editing
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


  // count completed tasks
  useEffect(() => {
    setCompletedTasks(tasks.filter((t) => t.completed));
  }, [tasks]);

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

      {/* Task Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            {/* Close button */}
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

      {tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6 mb-4 text-gray-700">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr className="border-gray-300 my-4" />

      {isLoading ? (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No tasks found. Please add some tasks.
        </p>
      ) : (
        <div className="space-y-3">
          {tasks
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
