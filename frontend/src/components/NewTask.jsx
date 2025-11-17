import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NewTaskForm from "../components/NewTaskForm";
import { URL } from "../App";

const NewTask = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    completed: false,
    labels: [],
  });

  const [allLabels, setAllLabels] = useState([]);

  const { name, dueDate } = formData;

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch labels for the logged-in user only
  const getLabels = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return toast.error("User not logged in");

    try {
      const { data } = await axios.get(`${URL}/api/labels?userId=${user._id}`);
      console.log(data);
      setAllLabels(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load labels");
    }
  };


  useEffect(() => {
    getLabels();
  }, []);

  // ✅ Create task and go to TaskList after success
  const createTask = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Task name is required");
    if (!user?._id) return toast.error("User not logged in");

    // Auto-set today's date if no due date
    const today = new Date().toISOString().split("T")[0];
    
    const dataToSend = {
      ...formData,
      dueDate: formData.dueDate || today,
      userId: user._id,
    };

    try {
      const res = await axios.post(`${URL}/api/tasks`, dataToSend);
      if (res.status === 201) {
        toast.success("Task added successfully!");
        setFormData({ name: "", dueDate: "", completed: false, labels: [] });
        setActivePage("all");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <NewTaskForm
      createTask={createTask}
      formData={formData}
      setFormData={setFormData}
      allLabels={allLabels}
    />
  );
};

export default NewTask;
