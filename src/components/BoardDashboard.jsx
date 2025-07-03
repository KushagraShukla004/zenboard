import React, { useState } from "react";
import { useTaskBoard } from "../context/TaskBoardContext";
import BoardCard from "./BoardCard";
import NewBoardForm from "./NewBoardForm";

// Main dashboard displaying all available boards
const BoardDashboard = ({ onViewBoard }) => {
  const { state, dispatch } = useTaskBoard();

  // UI state management
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Board creation handler
  const handleCreateBoard = (title) => {
    dispatch({
      type: "ADD_BOARD",
      payload: {
        id: `board-${Date.now()}`,
        title,
      },
    });
    setShowForm(false);
  };

  // Board deletion with confirmation
  const handleDeleteBoard = (boardId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this board? All columns and tasks will be removed."
      )
    ) {
      dispatch({ type: "DELETE_BOARD", payload: boardId });
    }
  };

  const filteredBoards = state.boards.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Your Boards</h2>
        <div className="flex space-x-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search boards..."
            className="px-4 py-2 border rounded-md w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Create New Board
          </button>
        </div>
      </div>

      {showForm && (
        <NewBoardForm onCreate={handleCreateBoard} onCancel={() => setShowForm(false)} />
      )}

      {state.loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading boards...</p>
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No boards found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm
              ? "No boards match your search."
              : "Create your first board to get started!"}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Create New Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => {
            const boardColumns = state.columns.filter((col) => col.boardId === board.id);
            const boardTasks = state.tasks.filter((task) => task.boardId === board.id);

            return (
              <BoardCard
                key={board.id}
                board={board}
                columns={boardColumns}
                tasks={boardTasks}
                onView={() => onViewBoard(board.id)}
                onDelete={() => handleDeleteBoard(board.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BoardDashboard;
