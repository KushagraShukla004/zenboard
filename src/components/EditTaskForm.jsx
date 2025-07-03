import React, { useState } from "react";

// Form component for editing existing tasks
const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  // Initialize form with existing task data
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.dueDate?.slice(0, 10) || "");
  const [creator, setCreator] = useState(task.creator || "");
  const [error, setError] = useState("");

  // Validation and update handling
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (dueDate && new Date(dueDate) < new Date()) {
      setError("Due date cannot be in the past");
      return;
    }
    onUpdate({
      title,
      description,
      priority,
      dueDate,
      creator: creator || "Anonymous",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-3">
      <h4 className="font-semibold mb-3">Edit Task</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Task title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="2"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setError("");
              }}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Creator</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Your name"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
