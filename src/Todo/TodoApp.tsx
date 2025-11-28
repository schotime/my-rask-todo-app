import { useState, useView, useMountEffect, useRef, useDerived, useAsync } from "rask-ui";
import { TodoInput } from "./TodoInput";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import type { FilterType, Todo } from "./types";
import { TodoHeader } from "./TodoHeader";
import { getTodos, saveTodos } from "./data";
import { RouterContext } from "./routes";
import { TodoSummary } from "./TodoSummary";

function useAsyncState<T>(cb: any, defaultValue: T) {
  const [asyncState, refresh] = useAsync(cb)
  return useView(asyncState, { get value() { return asyncState.value as T || defaultValue }, set value(v) { asyncState.value = v } }, { refresh });
}

export function TodoApp(props: {
  filter?: FilterType
}) {
  const router = RouterContext.use();
  const todoInputRef = useRef<HTMLInputElement>();

  const state = useState({
    selectedId: null as string | null,
    todos: useAsyncState<Todo[]>(getTodos, []),
    isSaving: false,
  });

  const derived = useDerived({
    filter: () => (props.filter || "all") as FilterType,
    stats: () => {
      const total = state.todos.value.length;
      const completed = state.todos.value.filter((t) => t.completed).length;
      const active = total - completed;
      return { total, completed, active };
    },
    filteredTodos: () => {
      switch (derived.filter) {
        case "active":
          return state.todos.value.filter((t) => !t.completed);
        case "completed":
          return state.todos.value.filter((t) => t.completed);
        default:
          return state.todos.value;
      }
    },
    visibleTodoIds: () => {
      return derived.filteredTodos.map((t) => t.id);
    }
  });

  const doSave = async () => {
    state.isSaving = true;
    try {
      await saveTodos(state.todos.value)
    }
    finally {
      state.isSaving = false;
    }
  };

  const addTodo = (text: string) => {
    const now = Date.now();
    state.todos.value.push({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    doSave();
  };

  const toggleTodo = (id: string) => {
    const todo = state.todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = Date.now();
      doSave();
    }
  };

  const deleteTodo = (id: string) => {
    const index = state.todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      state.todos.value.splice(index, 1);
      doSave();
    }
  };

  const editTodo = (id: string, newText: string) => {
    const todo = state.todos.value.find((t) => t.id === id);
    if (todo) {
      todo.text = newText;
      todo.updatedAt = Date.now();
      doSave();
    }
  };

  const changeFilter = (filter: FilterType) => {
    router.push("todos", { filter });
  };

  const clearCompleted = () => {
    state.todos.value = state.todos.value.filter((t) => !t.completed);
    doSave();
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
      const selectedTodo = state.todos.value.find((t) => t.id === state.selectedId);
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
    if (state.todos.isLoading && state.todos.value.length === 0) {
      return (
        <div class="w-full max-w-3xl mx-auto px-4">
          <div class="w-full bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
            <TodoHeader />
            <div class="py-16 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p class="mt-4 text-gray-600">Loading todos...</p>
            </div>
          </div>
        </div>
      );
    }

    if (state.todos.error) {
      return (
        <div class="w-full max-w-3xl mx-auto px-4">
          <div class="w-full bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
            <TodoHeader />
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-700 font-semibold">Failed to load todos</p>
              <p class="text-red-600 text-sm mt-1">{String(state.todos.error)}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class="flex flex-col h-full">
        <div class="flex-1 bg-white rounded-2xl shadow-xl p-8 overflow-hidden relative flex flex-col">
          {state.isSaving || state.todos.isRefreshing && (
            <div class="absolute top-4 right-4">
              <div class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
            </div>
          )}
          <TodoHeader />

          <TodoInput onAdd={view.addTodo} inputRef={todoInputRef} />

          <TodoFilters
            currentFilter={view.filter}
            onFilterChange={view.changeFilter}
            activeCount={view.stats.active}
            completedCount={view.stats.completed}
            totalCount={view.stats.total}
          />

          <div class="flex-1 overflow-y-auto">
            <TodoList
              todos={view.filteredTodos}
              selectedId={view.selectedId}
              onToggle={view.toggleTodo}
              onDelete={view.deleteTodo}
              onEdit={view.editTodo}
              onSelect={onSelect}
            />
          </div>

          <TodoSummary
            total={view.stats.total}
            active={view.stats.active}
            completed={view.stats.completed}
            onClearCompleted={view.clearCompleted}
          />
        </div>

        <footer class="text-center text-sm text-white mt-4">
          <p onDblClick={() => state.todos.refresh()}>
            N for new • ↑↓ to select • Space to check • E to edit • A for all • C for completed • O for active
          </p>
        </footer>
      </div>
    );
  };
}