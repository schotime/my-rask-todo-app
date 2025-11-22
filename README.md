# RASK Todo App

A modern, reactive todo application built with [RASK UI](https://github.com/christianalfoni/rask-ui). Features URL-based routing, localStorage persistence, and keyboard shortcuts for power users.

## Why

A reference implementation showcasing RASK UI's core strengths—reactive state management, type-safe routing, and a polished user experience. Perfect for developers learning the framework or building todo applications with modern tooling.

## Features

- **Reactive State Management** - RASK UI's reactive system automatically tracks and updates component state
- **URL-Based Routing** - Filter state persists in the URL using RASK UI's built-in router for shareability
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

