import React from "react";
import { TaskBoardProvider } from "./context/TaskBoardContext";

const App = () => {
  return (
    <TaskBoardProvider>
      <div>App</div>
    </TaskBoardProvider>
  );
};

export default App;
