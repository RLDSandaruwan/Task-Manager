import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaTasks,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaClock,
  FaListUl,
} from "react-icons/fa";

function Sidebar({ setActivePage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "today", label: "Today", icon: <FaClock /> },
    { id: "all", label: "All Tasks", icon: <FaListUl /> },
    { id: "upcoming", label: "Upcoming", icon: <FaCalendarAlt /> },
    { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { id: "completed", label: "Completed", icon: <FaCheckCircle /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } h-screen bg-white bg-opacity-90 shadow-lg flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        {/* Header with toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-purpleMain tracking-wide">
              Task Manager
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-purpleMain hover:text-orangeMain transition-colors"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 space-y-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className="flex items-center gap-3 text-darkBlue hover:text-purpleMain hover:bg-purple-100 px-3 py-2 rounded-lg transition-all w-full text-left"
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg transition-all w-full">
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
