import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";

const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  return (
    <div
      className={`flex justify-between items-center p-4 mb-3 border-l-4 rounded-lg shadow-sm transition-transform ${
        task.completed
          ? "border-green-500 bg-green-50"
          : "border-purpleMain bg-white hover:bg-purple-50"
      }`}
    >
      <p className="flex-1 text-gray-800 text-base">
        <b className="text-purpleMain">{index + 1}.</b> {task.name}
      </p>
      <div className="flex items-center gap-3 text-lg">
        <FaCheck
          className="cursor-pointer text-green-600 hover:scale-125 transition-transform"
          onClick={() => setToComplete(task)}
        />
        <FaRegEdit
          className="cursor-pointer text-purpleMain hover:scale-125 transition-transform"
          onClick={() => getSingleTask(task)}
        />
        <FaTrashAlt
          className="cursor-pointer text-red-500 hover:scale-125 transition-transform"
          onClick={() => deleteTask(task._id)}
        />
      </div>
    </div>
  );
};

export default Task;
