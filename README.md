# Zenboard - Task Board Application | [Zenboard Live](<[deployment-link](https://zenboard-eight.vercel.app/)>)

## Overview

Zenboard is a task management application built with React, designed to help teams organize and collaborate efficiently. It allows users to create boards, columns, and tasks, and to manage them with features like drag-and-drop, filtering, and prioritization.

## Features Breakdown

1. **Board Management**

   - Create and manage multiple boards
   - Intuitive board listing with search functionality
   - Delete boards with confirmation to prevent accidents

2. **Column Organization**

   - Horizontal layout for better visualization
   - Drag-and-drop column reordering
   - Customizable column titles

3. **Task Management**
   - Rich task details including title, description, priority, and due dates
   - Drag-and-drop between columns
   - Vertical stacking within columns
   - Advanced filtering and search capabilities

## Tech Stack

- **Frontend:** React with Hooks
- **Styling:** Tailwind CSS (no component libraries used)
- **State Management:** Context API
- **Data Persistence:** Local Storage
- **DnD Implementation:** @dnd-kit library

## Local Development

1. **Clone & Install:**

   ```bash
   git clone <repository-url>
   cd zenboard
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # UI components
├── context/       # Global state management
├── styles/        # Global styles
└── utils/         # Helper functions
```

## Key Features in Detail

- **Responsive Design:** Works seamlessly on desktop and tablet
- **Dark Mode:** Built-in theme switching capability
- **Data Persistence:** Auto-saves to localStorage
- **Error Handling:** Graceful error handling with user feedback

## Live Demo

Visit [Zenboard Live](<[deployment-link](https://zenboard-eight.vercel.app/)>) to try the application.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes with meaningful messages
4. Push to your branch
5. Open a Pull Request

## License

[MIT](LICENSE)
