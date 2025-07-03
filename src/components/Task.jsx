import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditTaskForm from "./EditTaskForm";
import { useTaskBoard } from "../context/TaskBoardContext";
import { isPast } from "date-fns";

// Individual task component with drag-and-drop functionality
const Task = ({ task }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { dispatch } = useTaskBoard();

  // DnD sortable configuration
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        columnId: task.columnId,
      },
    });

  // Visual styles for dragging states
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto",
  };

  // Task priority styling classes
  const priorityColors = {
    high: "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100",
    medium:
      "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100",
    low: "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100",
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !task.completed;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch({ type: "DELETE_TASK", payload: task.id });
    }
  };

  const handleUpdate = (updatedTask) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        ...task,
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      },
    });
    setShowEditForm(false);
  };

  if (showEditForm) {
    return (
      <EditTaskForm
        task={task}
        onUpdate={handleUpdate}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white text-white dark:bg-gray-700 rounded-lg shadow mb-3 p-3 cursor-grab task-shadow ${
        isDragging ? "shadow-lg" : ""
      }`}
      onClick={() => setShowEditForm(true)}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">{task.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="text-gray-500 hover:text-red-500 ml-2"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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

      {task.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {task.priority && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}

        {dueDate && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isOverdue
                ? "bg-red-100 border border-red-500 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100"
                : "bg-blue-100 border border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100"
            }`}
          >
            {new Date(dueDate).toLocaleDateString()} {isOverdue && "(Overdue)"}
          </span>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Created by: {task.creator || "Unknown"}
      </div>
    </div>
  );
};

export default Task;
