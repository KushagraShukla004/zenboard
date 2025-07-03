import React, { useState, useEffect } from "react";
import BoardDashboard from "./components/BoardDashboard";
import BoardDetail from "./components/BoardDetail";
import { TaskBoardProvider } from "./context/TaskBoardContext";
import "./App.css";

// Root component handling view management and theme switching
function App() {
  // Manage current view (dashboard/board detail) and theme state
  const [currentView, setCurrentView] = useState("dashboard");
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [theme, setTheme] = useState("light");

  // View navigation handlers
  const handleViewBoard = (boardId) => {
    setCurrentBoardId(boardId);
    setCurrentView("board-detail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setCurrentBoardId(null);
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <TaskBoardProvider>
        <header
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-blue-600"
          } text-white py-4 px-6 flex justify-between items-center`}
        >
          <h1 className="text-2xl font-bold">Task Board</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-blue-500"
              }`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            {currentView === "board-detail" && (
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </header>

        <main className="container min-h-screen mx-auto p-4">
          {currentView === "dashboard" ? (
            <BoardDashboard onViewBoard={handleViewBoard} />
          ) : (
            <BoardDetail boardId={currentBoardId} />
          )}
        </main>

        <footer
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-blue-600"
          } text-white text-center py-4`}
        >
          <p>Task Board Application © {new Date().getFullYear()}</p>
        </footer>
      </TaskBoardProvider>
    </div>
  );
}

export default App;
