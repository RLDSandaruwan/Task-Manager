const TaskForm = ({ createTask, name, handleInputChange, isEditing, updateTask }) => {
  return (
    <form
      className="flex gap-2 mt-5 mb-6"
      onSubmit={isEditing ? updateTask : createTask}
    >
      <input
        type="text"
        placeholder="Add a Task"
        name="name"
        value={name}
        onChange={handleInputChange}
        className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-base outline-none focus:ring-2 focus:ring-purpleMain"
      />
      <button
        type="submit"
        className={`px-4 py-2 text-white rounded-md transition ${
          isEditing ? "bg-orangeMain hover:bg-orange-600" : "bg-purpleMain hover:bg-purple-700"
        }`}
      >
        {isEditing ? "Edit" : "Add"}
      </button>
    </form>
  );
};

export default TaskForm;
