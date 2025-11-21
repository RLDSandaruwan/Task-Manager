import React, { useEffect, useRef, useState } from "react";

const TaskListTopBar = ({
  filter,
  setFilter,
  totalTasks,
  pendingCount,
  todayCount,
  overdueCount,
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);

  // close dropdown when clicking outside / escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setShowFilterMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
      ref={filterMenuRef}
    >
      {/* Filter trigger */}
      <div className="relative">
        <button
          onClick={() => setShowFilterMenu((s) => !s)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-sm text-todoist-text"
          aria-haspopup="true"
          aria-expanded={showFilterMenu}
        >
          <span>
            {filter === "all"
              ? "All Tasks"
              : filter === "pending"
              ? "Pending"
              : filter === "today"
              ? "Today"
              : "Overdue"}
          </span>
          <span className="text-xs text-todoist-textLight">
            {filter === "all"
              ? totalTasks
              : filter === "pending"
              ? pendingCount
              : filter === "today"
              ? todayCount
              : overdueCount}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-400 transition-transform ${
              showFilterMenu ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showFilterMenu && (
          <div className="absolute mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-40">
            <ul className="py-1 text-sm">
              <li>
                <button
                  onClick={() => {
                    setFilter("all");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 ${
                    filter === "all" ? "bg-amber-50 text-todoist-text" : "text-todoist-text hover:bg-gray-50"
                  }`}
                >
                  All Tasks
                  <span className="float-right text-xs text-todoist-textLight">{totalTasks}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("pending");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 ${
                    filter === "pending"
                      ? "bg-amber-50 text-todoist-text"
                      : "text-todoist-text hover:bg-gray-50"
                  }`}
                >
                  Pending
                  <span className="float-right text-xs text-todoist-textLight">{pendingCount}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("today");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 ${
                    filter === "today" ? "bg-amber-50 text-todoist-text" : "text-todoist-text hover:bg-gray-50"
                  }`}
                >
                  Today
                  <span className="float-right text-xs text-todoist-textLight">{todayCount}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("overdue");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 ${
                    filter === "overdue" ? "bg-amber-50 text-todoist-text" : "text-todoist-text hover:bg-gray-50"
                  }`}
                >
                  Overdue
                  <span className="float-right text-xs text-todoist-textLight">{overdueCount}</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between sm:justify-end gap-6 text-todoist-textLight text-sm">
        <p>
          <span className="font-medium text-todoist-text">Total:</span> {totalTasks}
        </p>
        <p>
          <span className="font-medium text-todoist-text">Overdue:</span> {overdueCount}
        </p>
      </div>
    </div>
  );
};

export default TaskListTopBar;
