import React, { useState } from "react";

const NewBoardForm = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Board title is required");
      return;
    }

    onCreate(title);
  };

  return (
    <div className="bg-white text-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Create New Board</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="boardTitle" className="block text-sm font-medium mb-1">
            Board Title
          </label>
          <input
            type="text"
            id="boardTitle"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter board title"
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
            Create Board
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBoardForm;
