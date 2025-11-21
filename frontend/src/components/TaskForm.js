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
      className="space-y-4"
    >
      {/* Task Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-todoist-text mb-2"
        >
          Task name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="e.g., Buy groceries"
          value={name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-todoist-red focus:ring-1 focus:ring-todoist-red transition-all"
          autoFocus
        />
      </div>

      {/* Due Date */}
      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-todoist-text mb-2"
        >
          Due date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={dueDate}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-todoist-red focus:ring-1 focus:ring-todoist-red transition-all"
        />

        {/* Quick select chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              const val = d.toISOString().split("T")[0];
              setformData((prev) => ({ ...prev, dueDate: val }));
            }}
            className="px-3 py-1.5 text-xs rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
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
            className="px-3 py-1.5 text-xs rounded-md border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + 7);
              const val = d.toISOString().split("T")[0];
              setformData((prev) => ({ ...prev, dueDate: val }));
            }}
            className="px-3 py-1.5 text-xs rounded-md border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Next week
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
          <p className="mt-3 text-xs text-todoist-red flex items-center gap-1">
            <span>⚠️</span> This date is in the past
          </p>
        )}
      </div>

      {/* Labels */}
      <div>
        <label
          htmlFor="labels"
          className="block text-sm font-medium text-todoist-text mb-2"
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
          className="react-select-container text-sm"
          classNamePrefix="react-select"
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ? '#dc4c3e' : '#d1d5db',
              '&:hover': { borderColor: '#dc4c3e' },
              boxShadow: state.isFocused ? '0 0 0 1px #dc4c3e' : 'none',
              borderRadius: '0.375rem',
              padding: '2px',
              minHeight: '42px',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#f3f4f6',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#374151',
              fontSize: '0.875rem',
            }),
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className={`flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition-all ${
            isEditing
              ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
              : "bg-todoist-red hover:bg-red-700 active:bg-red-800"
          }`}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
