import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";

const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  // Format the date
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

  // Tailwind color classes for label badges
  const colors = [
    "bg-rose-100 text-rose-700",       // Soft red-pink
    "bg-sky-100 text-sky-700",         // Cool blue
    "bg-emerald-100 text-emerald-700", // Vibrant green
    "bg-amber-100 text-amber-700",     // Warm yellow-orange
    "bg-violet-100 text-violet-700",   // Modern purple
    "bg-fuchsia-100 text-fuchsia-700", // Bold pink
    "bg-cyan-100 text-cyan-700",       // Aqua blue
    "bg-orange-100 text-orange-700",   // Bright orange
    "bg-indigo-100 text-indigo-700",   // Deep blue-purple
    "bg-zinc-100 text-zinc-700",       // Neutral gray
  ];


  // Normalize labels safely
  const labelList = Array.isArray(task.labels)
    ? task.labels
    : typeof task.labels === "string"
      ? task.labels.split(",").map((l) => l.trim())
      : [];

  return (
    <div
      className={`flex justify-between items-center p-4 mb-3 border-l-4 rounded-lg shadow-sm transition-transform ${task.completed
          ? "border-green-500 bg-green-50"
          : "border-purpleMain bg-white hover:bg-purple-50"
        }`}
    >
      {/* Left Section */}
      <div className="flex-1 text-gray-800 text-base">
        <p className="flex flex-wrap items-center gap-2">
          <b className="text-purpleMain">{index + 1}.</b> {task.name}
          {labelList.map((label, i) => {
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];
            return (
              <span
                key={i}
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${randomColor}`}
              >
                #{label}
              </span>
            );
          })}
        </p>

        <p
          className={`text-sm mt-1 ${formattedDate.includes("Today")
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
