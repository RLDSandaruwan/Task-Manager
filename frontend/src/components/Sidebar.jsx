import React, { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaListUl,
  FaHashtag,
  FaEdit,
  FaHourglassHalf,
  FaSignOutAlt,
} from "react-icons/fa";
import { VscLayoutSidebarRightOff, VscCheckAll } from "react-icons/vsc";

function Sidebar({ setActivePage }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hover, setHover] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const popupRef = useRef(null); // ✅ ref for popup

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest User",
    email: "guest@example.com",
  };

  // Today’s date parts
  const today = new Date();
  const day = today.getDate();

  const navItems = [
    { id: "new", label: "New Task", icon: <FaEdit /> },
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
    { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { id: "completed", label: "Completed", icon: <FaCheckCircle /> },
    { id: "labels", label: "Labels", icon: <FaHashtag /> },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // ✅ Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-75"
      } min-h-screen bg-white shadow-lg flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        {/* Header with toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-purpleMain tracking-wide">
              Task Manager
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="flex items-center justify-center text-purpleMain transition-colors w-10 h-10 rounded-lg hover:bg-purple-50 cursor-ew-resize select-none"
          >
            {hover ? (
              <VscLayoutSidebarRightOff size={22} />
            ) : (
              <VscCheckAll size={22} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 space-y-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setShowProfilePopup(false); // ✅ hide popup when switching page
              }}
              className="flex items-center gap-3 text-darkBlue hover:text-purpleMain hover:bg-purple-100 px-3 py-2 rounded-lg transition-all w-full text-left"
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div
        className={`relative px-3 py-4 border-t border-gray-200 flex items-center ${
          isCollapsed ? "justify-start" : "justify-center"
        }`}
      >
        {/* Profile Circle */}
        <button
          onClick={() => setShowProfilePopup(!showProfilePopup)}
          className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-purple-200 transition-all relative"
          title={user.name}
        >
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="bg-purple-300 w-full h-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {/* Show name & email inline when expanded */}
        {!isCollapsed && (
          <div className="ml-3 text-left">
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        {/* Popup — Always right of the circle */}
        {showProfilePopup && (
          <div
            ref={popupRef}
            className="absolute left-full ml-4 bottom-2 bg-white shadow-xl border rounded-xl p-4 w-64 z-20"
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
