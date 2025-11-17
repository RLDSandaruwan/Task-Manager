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
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5"
      ref={filterMenuRef}
    >
      {/* Filter trigger */}
      <div className="relative">
        <button
          onClick={() => setShowFilterMenu((s) => !s)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm text-sm font-medium"
          aria-haspopup="true"
          aria-expanded={showFilterMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 01.894 1.447l-6.5 13A1 1 0 0113.5 18H10a1 1 0 01-.894-.553L3.106 5.447A1 1 0 013 4z"
            />
          </svg>
          <span className="text-gray-800">
            {filter === "all"
              ? "All Tasks"
              : filter === "pending"
              ? "Pending Tasks"
              : filter === "today"
              ? "Today Tasks"
              : "Overdue Tasks"}
          </span>
          <span className="ml-2 inline-flex items-center justify-center bg-white text-xs text-gray-700 rounded-full px-2 py-0.5">
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
            className={`h-4 w-4 text-gray-500 transition-transform ${
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
          <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-40">
            <ul className="py-1 text-sm">
              <li>
                <button
                  onClick={() => {
                    setFilter("all");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    filter === "all" ? "bg-purpleMain text-white" : "hover:bg-gray-50"
                  }`}
                >
                  All Tasks
                  <span className="float-right text-xs text-gray-600">{totalTasks}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("pending");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    filter === "pending"
                      ? "bg-purpleMain text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Pending Tasks
                  <span className="float-right text-xs text-gray-600">{pendingCount}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("today");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    filter === "today" ? "bg-purpleMain text-white" : "hover:bg-gray-50"
                  }`}
                >
                  Today Tasks
                  <span className="float-right text-xs text-gray-600">{todayCount}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter("overdue");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    filter === "overdue" ? "bg-purpleMain text-white" : "hover:bg-gray-50"
                  }`}
                >
                  Overdue Tasks
                  <span className="float-right text-xs text-gray-600">{overdueCount}</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between sm:justify-end gap-6 text-gray-700 text-sm">
        <p>
          <b>Total:</b> {totalTasks}
        </p>
        <p>
          <b>Overdue:</b> {overdueCount}
        </p>
      </div>
    </div>
  );
};

export default TaskListTopBar;
