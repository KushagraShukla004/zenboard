import React, { useState } from "react";

// Form component for creating new columns
const NewColumnForm = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onCreate(title.trim());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Create New Column</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="columnTitle" className="block text-sm font-medium mb-1">
            Column Title
          </label>
          <input
            type="text"
            id="columnTitle"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter column title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Create Column
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewColumnForm;
