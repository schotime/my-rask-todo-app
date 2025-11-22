import { useState, useView, useMountEffect, useEffect, useRef, useContext, useDerived } from "rask-ui";
import { TodoInput } from "./TodoInput";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import type { Todo, FilterType } from "./types";
import { TodoHeader } from "./TodoHeader";
import { getTodos, saveTodos } from "./data";
import { RouterContext } from "./routes";
import { TodoSummary } from "./TodoSummary";

export function TodoApp(props: {
  filter?: FilterType
}) {

  const router = useContext(RouterContext);
  const todoInputRef = useRef<HTMLInputElement>();

  const state = useState({
    todos: getTodos(),
    selectedId: null as string | null,
  });

  const derived = useDerived({
    filter: () => (props.filter || "all") as FilterType,
    stats: () => {
      const total = state.todos.length;
      const completed = state.todos.filter((t) => t.completed).length;
      const active = total - completed;
      return { total, completed, active };
    },
    filteredTodos: () => {
      switch (derived.filter) {
        case "active":
          return state.todos.filter((t) => !t.completed);
        case "completed":
          return state.todos.filter((t) => t.completed);
        default:
          return state.todos;
      }
    },
    visibleTodoIds: () => {
      return derived.filteredTodos.map((t) => t.id);
    }
  });

  const addTodo = (text: string) => {
    const now = Date.now();
    state.todos.push({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
  };

  const toggleTodo = (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = Date.now();
    }
  };

  const deleteTodo = (id: string) => {
    const index = state.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      state.todos.splice(index, 1);
    }
  };

  const editTodo = (id: string, newText: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      todo.text = newText;
      todo.updatedAt = Date.now();
    }
  };

  const changeFilter = (filter: FilterType) => {
    router.push("todos", { filter });
  };

  const clearCompleted = () => {
    state.todos = state.todos.filter((t) => !t.completed);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't handle keyboard shortcuts if user is typing in an input
    const target = e.target as HTMLElement;
    const isInputFocused = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

    const visibleIds = derived.visibleTodoIds;
    const currentIndex = state.selectedId ? visibleIds.indexOf(state.selectedId) : -1;

    if (e.key === "ArrowDown") {
      if (!isInputFocused) {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < visibleIds.length) {
          state.selectedId = visibleIds[nextIndex];
        }
      }
    } else if (e.key === "ArrowUp") {
      if (!isInputFocused) {
        e.preventDefault();
        if (currentIndex > 0) {
          state.selectedId = visibleIds[currentIndex - 1];
        }
      }
    } else if (e.key === "e" && state.selectedId && !isInputFocused) {
      e.preventDefault();
      const selectedTodo = state.todos.find((t) => t.id === state.selectedId);
      if (selectedTodo) {
        // Trigger edit mode by dispatching a custom event
        const event = new CustomEvent("editTodo", { detail: { id: state.selectedId } });
        document.dispatchEvent(event);
      }
    } else if (e.key === " " && state.selectedId && !isInputFocused) {
      e.preventDefault();
      toggleTodo(state.selectedId);
    } else if (e.key === "n" && !isInputFocused) {
      e.preventDefault();
      if (todoInputRef.current) {
        todoInputRef.current.focus();
      }
    } else if (e.key === "a" && !isInputFocused) {
      e.preventDefault();
      router.push("todos", { filter: "all" });
    } else if (e.key === "c" && !isInputFocused) {
      e.preventDefault();
      router.push("todos", { filter: "completed" });
    } else if (e.key === "o" && !isInputFocused) {
      e.preventDefault();
      router.push("todos", { filter: "active" });
    }
  };

  useMountEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    // Save todos to localStorage whenever state.todos changes
    saveTodos(state.todos);
  });

  const view = useView(state, derived, {
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changeFilter,
    clearCompleted
  });

  const onSelect = (id: string) => {
    state.selectedId = id;
  }

  return () => {
    return (
      <div class="w-full max-w-3xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <TodoHeader />

          <TodoInput onAdd={view.addTodo} inputRef={todoInputRef} />

          <TodoFilters
            currentFilter={view.filter}
            onFilterChange={view.changeFilter}
            activeCount={view.stats.active}
            completedCount={view.stats.completed}
            totalCount={view.stats.total}
          />

          <TodoList
            todos={view.filteredTodos}
            selectedId={view.selectedId}
            onToggle={view.toggleTodo}
            onDelete={view.deleteTodo}
            onEdit={view.editTodo}
            onSelect={onSelect}
          />

          <TodoSummary
            total={view.stats.total}
            active={view.stats.active}
            completed={view.stats.completed}
            onClearCompleted={view.clearCompleted}
          />
        </div>

        <footer class="mt-8 text-center text-sm text-white">
          <p>
            N for new • ↑↓ to select • Space to check • E to edit • A for all • C for completed • O for active
          </p>
        </footer>
      </div>
    );
  };
}