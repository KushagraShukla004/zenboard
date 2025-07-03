import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Column component handling task organization and drag-drop functionality
const Column = ({ column, tasks, onUpdate, onDelete, onAddTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  // Configure drag-drop sortable behavior
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: "column",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle column title update
  const handleUpdate = () => {
    onUpdate(column.id, title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow w-72 flex-shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className={`p-3 rounded-t-lg flex justify-between items-center cursor-grab ${
          column.title === "To Do"
            ? "bg-indigo-600"
            : column.title === "In Progress"
            ? "bg-amber-500"
            : column.title === "Done"
            ? "bg-emerald-500"
            : "bg-blue-500"
        }`}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            autoFocus
            className="w-full px-2 py-1 rounded bg-white bg-opacity-20 text-white focus:outline-none"
          />
        ) : (
          <h3
            className="font-semibold text-white cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column.title}
          </h3>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onDelete(column.id)}
            className="text-white hover:text-red-200"
            aria-label="Delete column"
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
      </div>

      <div className="p-3 min-h-[200px]">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddTask(column.id)}
          className="mt-2 w-full py-2 text-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded border border-dashed border-gray-400 dark:border-gray-600 hover:border-blue-400 transition"
        >
          + Add Task
        </button>
      </div>

      <div className="p-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
      </div>
    </div>
  );
};

export default Column;
