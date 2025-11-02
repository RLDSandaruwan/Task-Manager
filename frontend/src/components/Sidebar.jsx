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

import { FaHourglassHalf } from "react-icons/fa";

import { VscLayoutSidebarRightOff } from "react-icons/vsc";

function Sidebar({ setActivePage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Today’s date parts
  const today = new Date();
  const day = today.getDate();
  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const navItems = [
    {
      id: "today",
      label: "Today",
      icon: (
        <div className="relative w-5 h-5 flex items-center justify-center">
          <FaCalendarAlt className="text-lg text-current" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {day}
          </span>
        </div>
      ),
    },
    { id: "all", label: "All Tasks", icon: <FaListUl /> },
    { id: "upcoming", label: "Upcoming", icon: <FaHourglassHalf /> },
    { id: "calendar", label: "Calandar", icon: <FaCalendarAlt /> },
    { id: "completed", label: "Completed", icon: <FaCheckCircle /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
  ];


  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-60"
        } min-h-screen bg-white bg-opacity-90 shadow-lg flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        {/* Header with toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white bg-opacity-90 z-10">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-purpleMain tracking-wide">
              Task Manager
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center text-purpleMain hover:text-orangeMain transition-colors w-10 h-10 rounded-lg hover:bg-purple-50 cursor-ew-resize select-none"
          >
            <VscLayoutSidebarRightOff size={22} />
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

    </aside>
  );

}

export default Sidebar;
