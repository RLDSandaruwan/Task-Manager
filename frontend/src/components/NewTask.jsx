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

  // Fetch all labels
  const getLabels = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/labels`);
      setAllLabels(data);
    } catch {
      toast.error("Failed to load labels");
    }
  };

  useEffect(() => {
    getLabels();
  }, []);

  // ✅ Create task and go to TaskList after success
  const createTask = async (e) => {
    e.preventDefault();
    if (formData.name.trim() === "") return toast.error("Task name is required");

    const today = new Date().toISOString().split("T")[0];
    const dataToSend = {
      ...formData,
      dueDate: formData.dueDate || today,
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
