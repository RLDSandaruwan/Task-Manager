import { FaTrashAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";


const CompletedTaskItem = ({ task, index, deleteTask }) => {
  // Show when the task was completed (fallback to dueDate if missing)
  let completedText = "Time unavailable";
  if (task.completedAt) {
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
  } else if (task.dueDate) {
    const dt = new Date(task.dueDate);
    if (!isNaN(dt)) {
      completedText = dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  const labelList = Array.isArray(task.labels)
    ? task.labels
    : typeof task.labels === "string"
      ? task.labels.split(",").map((l) => l.trim())
      : [];

  return (
    <div className="flex justify-between items-center p-4 mb-3 border-l-4 rounded-lg shadow-sm transition bg-green-50 border-green-500">
      <div className="flex-1 text-gray-800 text-base">
        <p className="flex flex-wrap items-center gap-2">
          <b className="text-green-700">{index + 1}.</b> {task.name}
          {labelList.map((label, i) => {
            const labelName = label.name || label;
            const labelColor = label.color || "#6b7280"; // gray default
            return (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium rounded-full border"
                style={{
                  backgroundColor: `${labelColor}20`,
                  color: labelColor,
                  borderColor: labelColor,
                }}
              >
                #{labelName}
              </span>
            );
          })}
        </p>
        <div className="flex items-center gap-1 text-sm mt-1 text-gray-600">
          <CiCalendarDate className="text-base" />
          <span>Completed · {completedText}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-lg">
        <FaTrashAlt
          className="cursor-pointer text-red-500 hover:scale-125 transition-transform"
          onClick={() => deleteTask(task._id)}
          title="Delete Task"
        />
      </div>
    </div>
  );
};

export default CompletedTaskItem;
