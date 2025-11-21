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
    <div className="w-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-todoist-text mb-1">Calendar</h1>
        <p className="text-sm text-todoist-textLight">
          View and manage your tasks by date
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <img src={loadingimg} alt="Loading" className="w-16 h-16" />
        </div>
      ) : (
        <>
          {/* Calendar Container */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex justify-center">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="border-0 w-full max-w-full"
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
          </div>

          {/* Tasks for Selected Date */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-todoist-text">
                {(() => {
                  const today = new Date();
                  const selected = new Date(selectedDate);
                  const diff = Math.round(
                    (selected.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
                    (1000 * 60 * 60 * 24)
                  );

                  if (diff === 0) return "Tasks for Today";
                  if (diff === 1) return "Tasks for Tomorrow";
                  if (diff === -1) return "Tasks for Yesterday";
                  return `Tasks for ${selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
                })()}
              </h3>
              <p className="text-sm text-todoist-textLight mt-1">
                {tasksForDate.length} {tasksForDate.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>

            {tasksForDate.length > 0 ? (
              <div className="p-3">
                {tasksForDate.map((task) => (
                  <div
                    key={task._id}
                    className="group flex items-start gap-3 py-2 px-1 hover:bg-gray-50 rounded transition-colors border-b border-gray-100 last:border-0"
                  >
                    {/* Checkbox or checkmark */}
                    <div className="flex-shrink-0 mt-1">
                      {task.completed ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-1 ${
                        task.completed
                          ? 'text-todoist-text line-through opacity-60'
                          : 'text-todoist-text'
                      }`}>
                        {task.name}
                      </p>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {task.labels.map((label, i) => {
                            const labelName = label.name || label;
                            const labelColor = label.color || "#808080";
                            return (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded font-medium"
                                style={{
                                  color: labelColor,
                                  backgroundColor: `${labelColor}15`,
                                  borderColor: `${labelColor}40`,
                                  borderWidth: '1px',
                                }}
                              >
                                #{labelName}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 mt-1 ${
                        task.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {task.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-todoist-textLight mb-1">No tasks on this date</p>
                <p className="text-sm text-todoist-textLight">Select a different date to view tasks</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>

  );
};

export default TaskCalendar;
