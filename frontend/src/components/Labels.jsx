import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";

const Labels = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#888888");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.sub; 

  // ✅ Fetch all labels
  const fetchLabels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/labels?userId=${userId}`);
      setLabels(data);
    } catch (err) {
      toast.error("Failed to load labels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

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
      toast.error("Error deleting label");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
        Manage Labels
      </h2>

      <form
        onSubmit={createLabel}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6"
      >
        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded-full border-2"
            style={{ backgroundColor: color }}
            title="Pick label color"
          />

          {showColorPicker && (
            <div className="absolute top-10 left-0 z-10 bg-white border rounded-xl p-3 shadow-lg">
              {/* Overlapping Color Rows */}
              <div className="flex flex-col gap-2">
                {/* Row 1 */}
                <div className="flex -space-x-3">
                  {["#4CAF50", "#F87171", "#6366F1", "#06B6D4"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setColor(c);
                        setShowColorPicker(false);
                      }}
                      className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-black" : "border-white"
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Row 2 */}
                <div className="flex -space-x-3">
                  {["#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setColor(c);
                        setShowColorPicker(false);
                      }}
                      className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-black" : "border-white"
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Label Name */}
        <input
          type="text"
          placeholder="Enter label name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border-b border-gray-400 outline-none px-2 py-1"
        />

        {/* Add Button */}
        <button
          type="submit"
          className="bg-purpleMain text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Add Label
        </button>
      </form>

      {/* Label List */}
      <div className="flex flex-col gap-2 mt-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading labels...</p>
        ) : labels.length > 0 ? (
          labels.map((label) => (
            <div
              key={label._id}
              className="flex justify-between items-center border-b pb-1"
            >
              <span
                className="font-medium"
                style={{ color: label.color }}
              >{`#${label.name}`}</span>
              <button
                onClick={() => deleteLabel(label._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No labels found</p>
        )}
      </div>
    </div>
  );
};

export default Labels;
