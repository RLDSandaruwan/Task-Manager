import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";

const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  // Format due date
  let formattedDate = "No date";
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) formattedDate = "Due Today";
    else if (diffInDays === -1) formattedDate = "Yesterday";
    else if (diffInDays === 1) formattedDate = "Tomorrow";
    else if (diffInDays < -1)
      formattedDate = `Overdue: ${dueDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    else
      formattedDate = dueDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }

  // Normalize labels safely (backend might return array of objects or strings)
  const labelList = Array.isArray(task.labels)
    ? task.labels
    : typeof task.labels === "string"
    ? task.labels.split(",").map((l) => l.trim())
    : [];

  return (
    <div
      className={`flex justify-between items-center p-4 mb-3 border-l-4 rounded-lg shadow-sm transition-transform ${
        task.completed
          ? "border-green-500 bg-green-50"
          : "border-purpleMain bg-white hover:bg-purple-50"
      }`}
    >
      {/* Left Section */}
      <div className="flex-1 text-gray-800 text-base">
        <p className="flex flex-wrap items-center gap-2">
          <b className="text-purpleMain">{index + 1}.</b> {task.name}
          {/* Show labels with actual label color */}
          {labelList.map((label, i) => {
            const labelName = label.name || label; // handle object or string
            const labelColor = label.color || "#888888"; // fallback color
            return (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium rounded-full border"
                style={{
                  backgroundColor: `${labelColor}20`, // 20 = light transparent background
                  color: labelColor,
                  borderColor: labelColor,
                }}
              >
                #{labelName}
              </span>
            );
          })}
        </p>

        {/* Date status */}
        <p
          className={`text-sm mt-1 ${
            formattedDate.includes("Today")
              ? "text-orange-600 font-semibold"
              : formattedDate.includes("Tomorrow")
              ? "text-blue-600 font-semibold"
              : formattedDate.includes("Yesterday")
              ? "text-gray-600 italic"
              : formattedDate.includes("Overdue")
              ? "text-red-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          📅 {formattedDate}
        </p>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3 text-lg">
        <FaCheck
          className="cursor-pointer text-green-600 hover:scale-125 transition-transform"
          onClick={() => setToComplete(task)}
          title="Mark as Complete"
        />
        <FaRegEdit
          className="cursor-pointer text-purpleMain hover:scale-125 transition-transform"
          onClick={() => getSingleTask(task)}
          title="Edit Task"
        />
        <FaTrashAlt
          className="cursor-pointer text-red-500 hover:scale-125 transition-transform"
          onClick={() => deleteTask(task._id)}
          title="Delete Task"
        />
      </div>
    </div>
  );
};

export default Task;
