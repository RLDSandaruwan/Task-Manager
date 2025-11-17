import Select from "react-select";

const TaskForm = ({
  createTask,
  name,
  labels = [],
  allLabels = [],
  handleInputChange,
  isEditing,
  updateTask,
  dueDate,
  setformData,
}) => {
  // Convert backend labels to { value, label } format for React Select
  const labelOptions = allLabels.map((label) => ({
    value: label._id,
    label: label.name,
  }));

  // Handle React Select changes
  const handleLabelChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setformData((prev) => ({ ...prev, labels: selectedValues }));
  };

  // Pre-fill selected labels when editing
const selectedLabelOptions = labelOptions.filter((opt) =>
  (labels || []).includes(opt.value)
);

  return (
    <form
      onSubmit={isEditing ? updateTask : createTask}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 mb-6"
    >
      {/* Task Name + Labels */}
      <div className="col-span-1 sm:col-span-2">
        {/* Task Name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          Task Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter task name..."
          value={name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-purpleMain transition"
        />

        {/* Label Selector */}
        <label
          htmlFor="labels"
          className="block text-sm font-medium text-gray-600 mt-3 mb-1"
        >
          Labels (optional)
        </label>
        <Select
          id="labels"
          options={labelOptions}
          value={selectedLabelOptions}
          onChange={handleLabelChange}
          isMulti
          placeholder="Select labels..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Due Date + Quick Picks + Submit */}
      <div className="col-span-1 flex flex-col justify-between">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-purpleMain transition"
          />

          {/* Quick select chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                const val = d.toISOString().split("T")[0];
                setformData((prev) => ({ ...prev, dueDate: val }));
              }}
              className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              title="Set to yesterday (overdue)"
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                const val = d.toISOString().split("T")[0];
                setformData((prev) => ({ ...prev, dueDate: val }));
              }}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                const val = d.toISOString().split("T")[0];
                setformData((prev) => ({ ...prev, dueDate: val }));
              }}
              className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200"
            >
              Tomorrow
            </button>
          </div>

          {/* Overdue hint */}
          {dueDate && (() => {
            const sel = new Date(dueDate);
            const t = new Date();
            sel.setHours(0,0,0,0);
            t.setHours(0,0,0,0);
            return sel < t;
          })() && (
            <p className="mt-2 text-xs text-red-600">This date is in the past. The task will be marked as overdue until completed.</p>
          )}
        </div>

        <button
          type="submit"
          className={`mt-4 sm:mt-6 w-full px-4 py-2 text-white font-medium rounded-lg shadow transition ${
            isEditing
              ? "bg-orangeMain hover:bg-orange-600"
              : "bg-purpleMain hover:bg-purple-700"
          }`}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
