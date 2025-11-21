import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { URL } from "../App";

const Labels = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#888888");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const colorPickerRef = useRef(null);

  // Curated, accessible color palette (Todoist-like, balanced hues)
  const PALETTE = [
    { hex: "#DC4C3E", name: "Tomato" },
    { hex: "#E74C3C", name: "Red" },
    { hex: "#FF6B6B", name: "Coral" },
    { hex: "#FF9F43", name: "Orange" },
    { hex: "#F1C40F", name: "Yellow" },
    { hex: "#2ECC71", name: "Green" },
    { hex: "#27AE60", name: "Emerald" },
    { hex: "#1ABC9C", name: "Teal" },
    { hex: "#16A085", name: "Deep Teal" },
    { hex: "#3498DB", name: "Blue" },
    { hex: "#2E86DE", name: "Dodger Blue" },
    { hex: "#6C5CE7", name: "Indigo" },
    { hex: "#8E44AD", name: "Purple" },
    { hex: "#B33771", name: "Magenta" },
    { hex: "#FF7675", name: "Salmon" },
    { hex: "#E84393", name: "Pink" },
    { hex: "#95A5A6", name: "Gray" },
    { hex: "#7F8C8D", name: "Slate" },
    { hex: "#34495E", name: "Steel" },
    { hex: "#F39C12", name: "Amber" },
    { hex: "#D35400", name: "Rust" },
    { hex: "#00B894", name: "Mint" },
    { hex: "#55EFC4", name: "Aqua" },
    { hex: "#0984E3", name: "Azure" },
  ];

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.sub;

  // ✅ Fetch all labels
  const fetchLabels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/labels?userId=${userId}`);
      setLabels(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load labels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // ✅ Create a new label
  const createLabel = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return toast.error("Label name is required");

    try {
      const res = await axios.post(`${URL}/api/labels`, { name, color, userId });
      if (res.status === 201) {
        toast.success("Label created successfully!");
        setName("");
        setColor("#888888");
        setShowColorPicker(false);
        fetchLabels();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating label");
    }
  };

  // ✅ Delete a label
  const deleteLabel = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this label?")) return;
    try {
      await axios.delete(`${URL}/api/labels/${id}?userId=${userId}`);
      toast.success("Label deleted successfully");
      fetchLabels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting label");
    }
  };

  return (
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">Labels</h1>
        <p className="text-sm text-todoist-textLight">
          {labels.length} {labels.length === 1 ? 'label' : 'labels'}
        </p>
      </div>

      {/* Add Label Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-medium text-todoist-text mb-4">Create New Label</h3>
        <form
          onSubmit={createLabel}
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
        >
          {/* Color Picker */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-md border-2 border-gray-300 hover:border-gray-400 transition"
              style={{ backgroundColor: color }}
              title="Pick label color"
            />

            {showColorPicker && (
              <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg w-64">
                {/* Swatch grid */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {PALETTE.map(({ hex, name }) => (
                    <button
                      key={hex}
                      type="button"
                      title={name}
                      onClick={() => {
                        setColor(hex);
                        setShowColorPicker(false);
                      }}
                      className={`relative w-7 h-7 rounded-full border transition-transform hover:scale-110 ${
                        color.toLowerCase() === hex.toLowerCase()
                          ? "ring-2 ring-offset-2 ring-gray-400 border-white"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Label Name */}
          <input
            type="text"
            placeholder="Label name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-todoist-red focus:ring-1 focus:ring-todoist-red text-todoist-text"
          />

          {/* Add Button */}
          <button
            type="submit"
            className="bg-todoist-red text-white px-5 py-2 rounded-md hover:bg-red-700 transition font-medium"
          >
            Add Label
          </button>
        </form>
      </div>

      {/* Labels List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-todoist-textLight">
            Loading labels...
          </div>
        ) : labels.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {labels.map((label) => (
              <div
                key={label._id}
                className="group flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-todoist-text font-medium">
                    {label.name}
                  </span>
                </div>
                <button
                  onClick={() => deleteLabel(label._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-todoist-red transition p-2"
                  title="Delete label"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-todoist-textLight mb-1">No labels yet</p>
            <p className="text-sm text-todoist-textLight">Create your first label above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labels;
