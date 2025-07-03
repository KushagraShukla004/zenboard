import React, { useState } from "react";
import { useTaskBoard } from "../context/TaskBoardContext";
import Column from "./Column";
import NewColumnForm from "./NewColumnForm";
import NewTaskForm from "./NewTaskForm";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format } from "date-fns";

// Detailed view of a board showing columns and tasks
const BoardDetail = ({ boardId }) => {
  const { state, dispatch } = useTaskBoard();

  // UI state management
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("");

  // Drag and drop state
  const [activeId, setActiveId] = useState(null);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const board = state.boards.find((b) => b.id === boardId);
  const columns = state.columns
    .filter((col) => col.boardId === boardId)
    .sort((a, b) => a.order - b.order);

  const tasks = state.tasks
    .filter((task) => task.boardId === boardId)
    .filter((task) => {
      const matchesSearch =
        searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      const matchesDueDate =
        filterDueDate === "" ||
        (task.dueDate &&
          new Date(task.dueDate).toDateString() ===
            new Date(filterDueDate).toDateString());

      return matchesSearch && matchesPriority && matchesDueDate;
    })
    .sort((a, b) => a.order - b.order);

  const handleAddColumn = (title) => {
    dispatch({
      type: "ADD_COLUMN",
      payload: {
        id: `col-${Date.now()}`,
        title,
        boardId,
        order: columns.length,
      },
    });
    setShowNewColumnForm(false);
  };

  const handleUpdateColumn = (columnId, title) => {
    dispatch({
      type: "UPDATE_COLUMN",
      payload: {
        id: columnId,
        title,
      },
    });
  };

  const handleDeleteColumn = (columnId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this column? All tasks in this column will be deleted."
      )
    ) {
      dispatch({ type: "DELETE_COLUMN", payload: columnId });
    }
  };

  const handleAddTask = (taskData) => {
    dispatch({
      type: "ADD_TASK",
      payload: {
        id: `task-${Date.now()}`,
        ...taskData,
        columnId: selectedColumnId,
        boardId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: tasks.filter((t) => t.columnId === selectedColumnId).length,
      },
    });
    setShowNewTaskForm(false);
    setSelectedColumnId(null);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If we're moving a column
    if (active.data.current?.type === "column") {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      if (oldIndex !== newIndex) {
        dispatch({
          type: "MOVE_COLUMN",
          payload: {
            sourceIndex: oldIndex,
            destinationIndex: newIndex,
            boardId,
          },
        });
      }
    }

    // If we're moving a task
    if (active.data.current?.type === "task") {
      const sourceColumnId = active.data.current.columnId;
      const destinationColumnId = over.data.current?.columnId || sourceColumnId;

      const sourceTasks = tasks
        .filter((task) => task.columnId === sourceColumnId)
        .sort((a, b) => a.order - b.order);

      const destinationTasks = tasks
        .filter((task) => task.columnId === destinationColumnId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = sourceTasks.findIndex((task) => task.id === activeId);

      // If moving within same column
      if (sourceColumnId === destinationColumnId) {
        const newIndex = destinationTasks.findIndex((task) => task.id === overId);

        if (oldIndex !== newIndex) {
          dispatch({
            type: "MOVE_TASK",
            payload: {
              taskId: activeId,
              sourceColumnId,
              destinationColumnId,
              sourceIndex: oldIndex,
              destinationIndex: newIndex,
            },
          });
        }
      }
      // If moving to different column
      else {
        const newIndex = destinationTasks.findIndex((task) => task.id === overId);

        dispatch({
          type: "MOVE_TASK",
          payload: {
            taskId: activeId,
            sourceColumnId,
            destinationColumnId,
            sourceIndex: oldIndex,
            destinationIndex: newIndex,
          },
        });
      }
    }

    setActiveId(null);
  };

  // Find active task or column
  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null;
  const activeColumn = activeId ? columns.find((col) => col.id === activeId) : null;

  if (!board) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">{board.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Created: {format(new Date(board.createdAt), "MMM d, yyyy")} | Last modified:{" "}
            {format(new Date(board.updatedAt), "MMM d, yyyy h:mm a")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-4 py-2 border rounded-md w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <input
            type="date"
            className="px-4 py-2 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 text-white"
            value={filterDueDate}
            onChange={(e) => setFilterDueDate(e.target.value)}
          />

          <button
            onClick={() => setShowNewColumnForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition whitespace-nowrap"
          >
            Add Column
          </button>
        </div>
      </div>

      {showNewColumnForm && (
        <NewColumnForm
          onCreate={handleAddColumn}
          onCancel={() => setShowNewColumnForm(false)}
        />
      )}

      {showNewTaskForm && (
        <NewTaskForm
          onCreate={handleAddTask}
          onCancel={() => {
            setShowNewTaskForm(false);
            setSelectedColumnId(null);
          }}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex overflow-x-auto pb-4 gap-4">
            {columns.map((column) => {
              const columnTasks = tasks.filter((task) => task.columnId === column.id);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onUpdate={handleUpdateColumn}
                  onDelete={handleDeleteColumn}
                  onAddTask={(columnId) => {
                    setSelectedColumnId(columnId);
                    setShowNewTaskForm(true);
                  }}
                />
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-3 w-64 opacity-90">
              <h4 className="font-semibold">{activeTask.title}</h4>
            </div>
          )}
          {activeColumn && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg w-72">
              <div className="p-3 bg-blue-500 text-white rounded-t-lg">
                <h3 className="font-semibold">{activeColumn.title}</h3>
              </div>
              <div className="p-3 min-h-[100px]"></div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {columns.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No columns yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create your first column to start adding tasks
          </p>
          <button
            onClick={() => setShowNewColumnForm(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Column
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
