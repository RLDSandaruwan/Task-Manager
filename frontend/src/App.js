import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";

import Today from "./components/Today";
import Upcoming from "./components/Upcoming";
import Calendar from "./components/Calendar";
import Completed from "./components/Completed";
import Profile from "./components/Profile";
import Labels from "./components/Labels";
import NewTask from "./components/NewTask";

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [activePage, setActivePage] = useState("all");

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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-sky-50 to-white text-darkBlue">

      {/* bg-gradient-to-br from-indigo-100 via-sky-50 to-white */}
      {/* min-h-screen flex bg-gradient-to-br from-purple-100 via-blue-50 to-white */}

      {/* Sidebar */}
      <Sidebar setActivePage={setActivePage} />

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {renderPage()}
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}

export default App;
