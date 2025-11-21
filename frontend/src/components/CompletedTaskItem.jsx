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
    <div className="group flex items-start gap-3 py-2 px-1 rounded transition-colors">
      {/* Green checkmark */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-todoist-text  opacity-60 mb-1">
          {task.name}
        </p>
        
        {/* Date and labels below */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-green-600">
            {completedText}
          </span>
          {labelList.map((label, i) => {
            const labelName = label.name || label;
            const labelColor = label.color || "#6b7280";
            return (
              <span
                key={i}
                className="px-2 py-0.5 rounded font-medium"
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
        </div>
      </div>

      {/* Actions - Hidden until hover */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
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

export default CompletedTaskItem;
