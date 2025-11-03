
import Select from "react-select";

const NewTaskForm = ({ createTask, formData, setFormData, allLabels = [] }) => {
  const { name, labels = [], dueDate } = formData;

  // Convert backend labels to { value, label } format for React Select
  const labelOptions = allLabels.map((label) => ({
    value: label._id,
    label: label.name,
  }));

  // Handle input changes for name and due date
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle label selection
  const handleLabelChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : [];
    setFormData((prev) => ({ ...prev, labels: selectedValues }));
  };

  // Pre-select existing labels
  const selectedLabelOptions = labelOptions.filter((opt) =>
    (labels || []).includes(opt.value)
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto w-full">
      <form
        onSubmit={createTask}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 mb-6"
      >
        {/* Task Name + Labels */}
        <div className="col-span-1 sm:col-span-2">
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
            className="mt-4 sm:mt-6 w-full px-4 py-2 text-white font-medium rounded-lg shadow bg-purpleMain hover:bg-purple-700 transition"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm ;
