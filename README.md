# RASK Todo App

A modern, reactive todo application built with [RASK UI](https://github.com/infernojs/rask-ui) and [Inferno](https://infernojs.org/). Features URL-based routing, localStorage persistence, and keyboard shortcuts for power users.

## Features

- **Reactive State Management** - Built on RASK UI's reactive state system
- **URL-Based Routing** - Filter state persists in the URL using inferno-router
- **localStorage Persistence** - All todos automatically save to browser storage
- **Keyboard Shortcuts** - Full keyboard control for efficient todo management
- **Responsive Design** - Clean, modern UI with Tailwind CSS
- **Filter Support** - View all, active, or completed todos

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **N** | Focus new todo input |
| **↑↓** | Navigate todos (requires selection) |
| **Space** | Toggle todo completion |
| **E** | Edit selected todo |
| **A** | Show all todos |
| **C** | Show completed todos |
| **O** | Show active todos |
| **Esc** | Clear input & unfocus |

## Tech Stack

- **RASK UI** - Reactive state management & component framework
- **Inferno** - Fast, React-like rendering engine
- **inferno-router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool & dev server

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── Todo/
│   ├── TodoApp.tsx       # Main todo app component with routing
│   ├── TodoInput.tsx     # New todo input form
│   ├── TodoFilters.tsx   # Filter buttons (All, Active, Completed)
│   ├── TodoList.tsx      # Todo list display
│   └── TodoItem.tsx      # Individual todo item
├── App.tsx               # Root app with router setup
├── main.tsx              # Entry point
└── index.css             # Tailwind + global styles
```

## How It Works

### State Management
The app uses RASK UI's `useState` for reactive state:
- Todos persist to localStorage via `useEffect`
- Filter state syncs with URL params via `withRouter`

### Routing
Routes are defined in `App.tsx`:
- `/` - Default route (shows all todos)
- `/todos/:filter?` - Filter-based routes (all, active, completed)

### Persistence
Todos are automatically saved to localStorage using `useEffect` whenever the todos array changes. On app load, saved todos are restored or default todos are shown.

### Keyboard Handling
Global keyboard shortcuts are managed via `useMountEffect` in TodoApp. Shortcuts navigate routes or interact with todos without requiring mouse clicks.

## Data Format

Each todo has the following structure:
```typescript
interface Todo {
  id: string;              // Unique identifier
  text: string;            // Todo text content
  completed: boolean;      // Completion status
  createdAt: number;       // Timestamp of creation
}
```

Todos are stored in localStorage under the key `rask-todos` as JSON.
