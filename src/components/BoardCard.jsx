import React from "react";
import { format } from "date-fns";

// Card component displaying board summary and statistics
const BoardCard = ({ board, columns, tasks, onView, onDelete }) => {
  // Calculate board statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) =>
      columns.find((col) => col.id === task.columnId)?.title.toLowerCase() === "done"
  ).length;

  // Prevent event bubbling for delete action
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="bg-white text-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={onView}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 truncate">
            {board.title}
          </h3>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 ml-2"
            aria-label="Delete board"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: columnColors[column.title] || "#fff" }}
              ></div>
              <span className="text-xs font-medium">
                {column.title}: {tasks.filter((t) => t.columnId === column.id).length}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Created:</span>{" "}
            {format(new Date(board.createdAt), "MMM d, yyyy")}
          </div>
          <div>
            <span className="font-medium">Tasks:</span> {totalTasks}
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Completed Tasks:</span> {completedTasks}
        </div>

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Last modified:</span>{" "}
          {format(new Date(board.updatedAt), "MMM d, yyyy h:mm a")}
        </div>
      </div>
    </div>
  );
};

const columnColors = {
  "To Do": "#4F46E5",
  "In Progress": "#F59E0B",
  Done: "#10B981",
};

export default BoardCard;
