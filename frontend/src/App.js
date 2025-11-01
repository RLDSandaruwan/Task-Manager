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

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [activePage, setActivePage] = useState("today");

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
      default:
        return <Today />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purpleMain to-lightBlue text-darkBlue">
      {/* Sidebar */}
      <Sidebar setActivePage={setActivePage} />

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 overflow-y-auto max-h-[80vh]">
          {renderPage()}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}

export default App;
