/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useReducer } from "react";

// Create context for global state management
const TaskBoardContext = createContext();

// Initial state structure for the application
const initialState = {
  boards: [],
  columns: [],
  tasks: [],
  loading: true,
};

// Main reducer to handle all state modifications
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT_STATE":
      return {
        ...state,
        ...action.payload,
        loading: false,
      };

    case "ADD_BOARD": {
      const newBoard = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        boards: [...state.boards, newBoard],
      };
    }

    case "UPDATE_BOARD":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id
            ? { ...board, ...action.payload, updatedAt: new Date().toISOString() }
            : board
        ),
      };

    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        columns: state.columns.filter((column) => column.boardId !== action.payload),
        tasks: state.tasks.filter((task) => task.boardId !== action.payload),
      };

    case "ADD_COLUMN":
      return {
        ...state,
        columns: [...state.columns, action.payload],
      };

    case "UPDATE_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.payload.id ? { ...column, ...action.payload } : column
        ),
      };

    case "DELETE_COLUMN":
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.payload),
        tasks: state.tasks.filter((task) => task.columnId !== action.payload),
      };

    case "MOVE_COLUMN": {
      const { sourceIndex, destinationIndex, boardId } = action.payload;
      const boardColumns = state.columns
        .filter((col) => col.boardId === boardId)
        .sort((a, b) => a.order - b.order);

      const [movedColumn] = boardColumns.splice(sourceIndex, 1);
      boardColumns.splice(destinationIndex, 0, movedColumn);

      const updatedColumns = boardColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      return {
        ...state,
        columns: state.columns.map((col) => {
          const updatedCol = updatedColumns.find((uc) => uc.id === col.id);
          return updatedCol ? updatedCol : col;
        }),
      };
    }

    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "MOVE_TASK": {
      // Extract necessary data for task movement
      const { taskId, sourceColumnId, destinationColumnId, destinationIndex } =
        action.payload;

      // Find the task that needs to be moved
      const taskToMove = state.tasks.find((task) => task.id === taskId);
      if (!taskToMove) return state;

      // Get sorted tasks for source and destination columns
      const tasksInSource = state.tasks
        .filter((task) => task.columnId === sourceColumnId && task.id !== taskId)
        .sort((a, b) => a.order - b.order);

      const tasksInDestination = state.tasks
        .filter((task) => task.columnId === destinationColumnId)
        .sort((a, b) => a.order - b.order);

      // Insert task at new position
      tasksInDestination.splice(destinationIndex, 0, {
        ...taskToMove,
        columnId: destinationColumnId,
      });

      // Recalculate orders for affected tasks
      const updatedTasks = [
        ...tasksInSource.map((task, index) => ({ ...task, order: index })),
        ...tasksInDestination.map((task, index) => ({ ...task, order: index })),
      ];

      return {
        ...state,
        tasks: state.tasks.map((task) => {
          const updatedTask = updatedTasks.find((ut) => ut.id === task.id);
          return updatedTask ? updatedTask : task;
        }),
      };
    }

    default:
      return state;
  }
};

// Provider component for wrapping the application
export const TaskBoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize state from localStorage
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("taskBoardState"));
    if (savedState) {
      dispatch({ type: "INIT_STATE", payload: savedState });
    } else {
      // Create initial data if none exists
      const initialBoard = {
        id: "board-1",
        title: "My First Board",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const initialColumns = [
        { id: "col-1", title: "To Do", boardId: "board-1", order: 0 },
        { id: "col-2", title: "In Progress", boardId: "board-1", order: 1 },
        { id: "col-3", title: "Done", boardId: "board-1", order: 2 },
      ];

      const initialTasks = [
        {
          id: "task-1",
          title: "Welcome to Task Board!",
          description: "This is your first task. Drag and drop me to other columns!",
          columnId: "col-1",
          boardId: "board-1",
          priority: "medium",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          creator: "System",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: 0,
        },
        {
          id: "task-2",
          title: "Create your own board",
          description: 'Click the "Create New Board" button to get started',
          columnId: "col-2",
          boardId: "board-1",
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          creator: "System",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: 0,
        },
        {
          id: "task-3",
          title: "Drag tasks around",
          description: "Try moving tasks between columns by dragging them",
          columnId: "col-3",
          boardId: "board-1",
          priority: "low",
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          creator: "System",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: 0,
        },
      ];

      dispatch({
        type: "INIT_STATE",
        payload: {
          boards: [initialBoard],
          columns: initialColumns,
          tasks: initialTasks,
        },
      });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("taskBoardState", JSON.stringify(state));
    }
  }, [state]);

  return (
    <TaskBoardContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskBoardContext.Provider>
  );
};

// Custom hook for accessing the context
export const useTaskBoard = () => useContext(TaskBoardContext);
