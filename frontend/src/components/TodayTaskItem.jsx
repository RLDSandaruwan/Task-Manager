import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";

const TodayTaskItem = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  // Normalize labels safely
  const labelList = Array.isArray(task.labels)
    ? task.labels
    : typeof task.labels === "string"
      ? task.labels.split(",").map((l) => l.trim())
      : [];

  // Format completion time if completed
  let completedText = "";
  if (task.completed && task.completedAt) {
    const dt = new Date(task.completedAt);
    if (!isNaN(dt)) {
      completedText = dt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  if (task.completed) {
    // COMPLETED TASK - Todoist style
    return (
      <div className="group flex items-start gap-3 py-2 px-1 hover:bg-gray-50 rounded transition-colors">
        <button className="mt-1 w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center flex-shrink-0">
          <FaCheck className="text-white text-xs" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 line-through truncate">
            {task.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {labelList.map((label, i) => {
              const labelName = label.name || label;
              const labelColor = label.color || "#808080";
              return (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    color: labelColor,
                    backgroundColor: `${labelColor}15`,
                  }}
                >
                  #{labelName}
                </span>
              );
            })}
            {completedText && (
              <span className="text-xs text-gray-400">· {completedText}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => deleteTask(task._id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
          title="Delete Task"
        >
          <FaTrashAlt className="text-sm" />
        </button>
      </div>
    );
  }

  // INCOMPLETE TASK - Show all actions and date status
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

  return (
    <div className="group flex items-start gap-3 py-2 px-1 hover:bg-gray-50 rounded transition-colors border-b border-gray-100 last:border-0">
      {/* Checkbox */}
      <button
        onClick={() => setToComplete(task)}
        className="mt-1 w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center flex-shrink-0 transition-colors"
        title="Mark as Complete"
      >
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-todoist-text mb-1">{task.name}</p>
        
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {formattedDate !== "No date" && (
            <span
              className={`flex items-center gap-1 ${
                formattedDate.includes("Today")
                  ? "text-green-600"
                  : formattedDate.includes("Overdue")
                    ? "text-todoist-red font-medium"
                    : "text-todoist-textLight"
              }`}
            >
              {formattedDate}
            </span>
          )}
          {labelList.map((label, i) => {
            const labelName = label.name || label;
            const labelColor = label.color || "#808080";
            return (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{
                  color: labelColor,
                  backgroundColor: `${labelColor}15`,
                  borderColor: `${labelColor}40`,
                  borderWidth: '1px',
                }}
              >
                #{labelName}
              </span>
            );
          })}
          {/* <span className="text-gray-400">Inbox</span> */}
        </div>
      </div>

      {/* Actions - Hidden until hover */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
        <button
          onClick={() => getSingleTask(task)}
          className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          title="Edit Task"
        >
          <FaRegEdit className="text-sm" />
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          className="text-gray-400 hover:text-todoist-red p-1 transition-colors"
          title="Delete Task"
        >
          <FaTrashAlt className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default TodayTaskItem;
