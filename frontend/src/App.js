import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskList from "./components/TaskList";
import Header from "./components/Header"; // 👈 Import Header

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purpleMain to-lightBlue text-darkBlue">
        {/* Header Component */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 overflow-y-auto max-h-[80vh]">
            <TaskList />
          </div>
        </main>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default App;
