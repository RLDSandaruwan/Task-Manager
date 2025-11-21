import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import Today from "./components/Today";
import Upcoming from "./components/Upcoming";
import Calendar from "./components/Calendar";
import Completed from "./components/Completed";
import Profile from "./components/Profile";
import Labels from "./components/Labels";
import NewTask from "./components/NewTask";
import LoginPage from "./components/LoginPage";

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [activePage, setActivePage] = useState("today");
  const [user, setUser] = useState(null);

  // ✅ Load saved user & page
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPage = localStorage.getItem("activePage");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPage) setActivePage(storedPage);
  }, []);

  // ✅ Save page whenever user changes it
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const renderPage = () => {
    switch (activePage) {
      case "today":
        return <Today />;
      case "all":
        return <TaskList />;
      case "upcoming":
        return <Upcoming />;
      case "calendar":
        return <Calendar />;
      case "completed":
        return <Completed />;
      case "profile":
        return <Profile />;
      case "labels":
        return <Labels />;
      case "new":
        return <NewTask setActivePage={setActivePage} />;
      default:
        return <Today />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-todoist-bg text-todoist-text">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          {renderPage()}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}

export default App;
