import React, { useState, useEffect, useRef } from "react";
import {
  FaInbox,
  FaCalendarDay,
  FaCalendar,
  FaBars,
  FaTimes,
  FaPlus,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaHashtag,
} from "react-icons/fa";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { HiViewGrid } from "react-icons/hi";
import { MdUpcoming } from "react-icons/md";
import { BsCheck2All } from "react-icons/bs";


function Sidebar({ setActivePage, activePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userPicError, setUserPicError] = useState(false);

  const popupRef = useRef(null);
  const sidebarRef = useRef(null);

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest User",
    email: "guest@example.com",
  };

  // Reset error state if user changes
  useEffect(() => {
    setUserPicError(false);
  }, [user.profilePic]);

  const navItems = [
    { id: "new", label: "Add task", icon: <FaPlus className="text-todoist-red" /> },
    { id: "today", label: "Today", icon: <FaCalendarDay className="text-green-600" /> },
    { id: "all", label: "All Tasks", icon: <FaInbox className="text-blue-600" /> },
    { id: "upcoming", label: "Upcoming", icon: <MdUpcoming className="text-purple-600" /> },
    { id: "calendar", label: "Calendar", icon: <FaCalendar className="text-indigo-600" /> },
    { id: "completed", label: "Completed", icon: <BsCheck2All className="text-gray-600" /> },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Close popup and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (showProfilePopup || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup, isMobileMenuOpen]);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setShowProfilePopup(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          <VscLayoutSidebarLeftOff className="text-2xl text-gray-700" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:sticky top-0 h-screen
          w-[305px] bg-todoist-sidebar
          border-r border-todoist-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          z-50 lg:z-auto
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto">
          {/* App Branding */}
          <div className="px-5 py-4 lg:py-5 border-b border-todoist-border mt-14 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-todoist-red to-orange-600 flex items-center justify-center shadow-sm">
                <HiViewGrid className="text-white text-lg" />
              </div>
              <h1 className="text-xl font-bold text-todoist-text">TaskFlow</h1>
            </div>
          </div>

          {/* Search and Add Task Buttons */}
          <div className="px-5 py-4 space-y-2">
            <button
              onClick={() => handleNavClick("new")}
              className="w-full flex items-center gap-3 px-3 py-2 text-todoist-red hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
            >
              <FaPlus className="text-sm" />
              <span>Add task</span>
            </button>
            {/* <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">
              <FaSearch className="text-sm" />
              <span>Search</span>
            </button> */}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2">
            {navItems.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm mb-1
                  ${activePage === item.id
                    ? "bg-amber-50 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className="text-xs text-gray-500 font-normal">{item.count}</span>
                )}
              </button>
            ))}
          </nav>

          {/* My Projects Section */}
          <div className="px-5 py-4 border-t border-todoist-border mt-4">
            <button
              onClick={() => handleNavClick("labels")}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                ${activePage === "labels"
                  ? "bg-amber-50 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <FaHashtag className="text-sm text-gray-500" />
              <span className="flex-1 text-left">Labels</span>
            </button>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="border-t border-todoist-border px-5 py-4 relative">
          <button
            onClick={() => setShowProfilePopup(!showProfilePopup)}
            className="flex items-center gap-3 w-full hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden">
              {user.profilePic && !userPicError ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => setUserPicError(true)}
                />
              ) : (
                user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
              )}
            </div>
            <span className="font-semibold text-todoist-text text-sm flex-1 text-left truncate">
              {user.name.split(' ')[0]}
            </span>
            <FaChevronDown className="text-gray-500 text-xs flex-shrink-0" />
          </button>

          {/* Profile Popup */}
          {showProfilePopup && (
            <div
              ref={popupRef}
              className="absolute bottom-full left-5 right-5 mb-2 bg-white shadow-2xl border border-gray-200 rounded-lg p-3 z-[60]"
            >
              <div className="flex flex-col">
                <div className="pb-3 border-b border-gray-200 mb-2">
                  <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
