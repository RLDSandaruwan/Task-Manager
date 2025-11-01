const TaskForm = ({
  createTask,
  name,
  handleInputChange,
  isEditing,
  updateTask,
  dueDate,
}) => {
  return (
    <form
      onSubmit={isEditing ? updateTask : createTask}
      className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 mb-6"
    >
      {/* Task Name Input */}
      <div className="flex-1 w-full">
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
      </div>

      {/* Due Date Input */}
      <div className="flex-none w-full sm:w-48">
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

      {/* Submit Button */}
      <div className="flex-none w-full sm:w-32 mt-1 sm:mt-6">
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white font-medium rounded-lg shadow transition ${
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
