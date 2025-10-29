import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskList from "./components/TaskList";

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <div className="min-h-screen bg-blue-100 flex items-center justify-center px-2">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 overflow-y-auto max-h-[90vh]">
          <TaskList />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
