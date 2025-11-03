import Select from "react-select";

const TaskForm = ({
  createTask,
  name,
  labels,
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
    labels.includes(opt.value)
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

      {/* Due Date + Submit */}
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
