import { URL } from "../App";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { toast } from "react-toastify";
import loadingimg from "../assets/loader.gif";

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  const getTasks = async () => {
    if (!user?._id) return toast.error("User not logged in");
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks/user/${user._id}`);
      setTimeout(() => {
        setTasks(data);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);


  // Find tasks on selected date
  const tasksForDate = tasks.filter(
    (task) =>
      new Date(task.dueDate).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
        Task Calendar
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      ) : (
        <>
          {/* Centered Calendar */}
          <div className="flex justify-center">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const hasTask = tasks.some(
                    (task) =>
                      new Date(task.dueDate).toDateString() === date.toDateString()
                  );
                  return hasTask
                    ? "react-calendar__tile has-task"
                    : "react-calendar__tile";
                }
                return "react-calendar__tile";
              }}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Tasks on{" "}
              {(() => {
                const today = new Date();
                const diff =
                  (selectedDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24);

                if (diff === 0) return "Today";
                if (diff === 1) return "Tomorrow";
                if (diff === -1) return "Yesterday";
                return selectedDate.toDateString();
              })()}
            </h3>

            {tasksForDate.length > 0 ? (
              <ul className="space-y-3">
                {tasksForDate.map((task) => (
                  <li
                    key={task._id}
                    className={`flex items-center justify-between p-3 rounded-lg shadow-sm border-l-4 transition-all duration-200 ${task.completed
                      ? "bg-purple-50 border-purple-500 text-purple-800"
                      : "bg-white border-red-500 text-red-800 hover:bg-red-50"
                      }`}
                  >
                    {/* Task name (truncated if too long) */}
                    <span className="font-medium truncate max-w-[60%]">{task.name}</span>

                    {/* Status badge */}
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${task.completed
                        ? "bg-purple-200 text-purple-800"
                        : "bg-red-200 text-red-800"
                        }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No tasks for this day.</p>
            )}
          </div>
        </>
      )}
    </div>

  );
};

export default TaskCalendar;
