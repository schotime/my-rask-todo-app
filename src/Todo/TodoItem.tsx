import { useState, useRef, useEffect, useMountEffect } from "rask-ui";

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onSelect: (id: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) {
    return seconds <= 0 ? "just now" : `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function TimeDisplay(props: { timestamp: number }) {
  const state = useState({
    updateTrigger: 0,
  });

  useMountEffect(() => {
    const interval = setInterval(() => {
      state.updateTrigger += 1;
    }, 30000);

    return () => clearInterval(interval);
  });

  return () => (
    <span class="text-xs text-gray-400 leading-none">
      {state.updateTrigger >= 0 ? formatTimeAgo(props.timestamp) : ""}
    </span>
  );
}

export function TodoItem(props: TodoItemProps) {
  const state = useState({
    isEditing: false,
    editText: props.todo.text,
  });

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (state.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  });

  const handleEditEvent = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.id === props.todo.id) {
      state.isEditing = true;
      state.editText = props.todo.text;
    }
  };

  useMountEffect(() => {
    document.addEventListener("editTodo", handleEditEvent);
    return () => {
      document.removeEventListener("editTodo", handleEditEvent);
    };
  });

  const startEditing = () => {
    state.isEditing = true;
    state.editText = props.todo.text;
  };

  const saveEdit = () => {
    if (state.editText.trim()) {
      props.onEdit(props.todo.id, state.editText.trim());
      state.isEditing = false;
    }
  };

  const cancelEdit = () => {
    state.isEditing = false;
    state.editText = props.todo.text;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return () => (
    <li
      class={`group flex items-center gap-2 p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${props.isSelected
        ? "bg-blue-50 border-2 border-blue-500"
        : "bg-white border-2 border-transparent"
        }`}
      onClick={() => props.onSelect(props.todo.id)}
    >
      {state.isEditing ? (
        <div class="flex-1 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={state.editText}
            onInput={(e) => (state.editText = (e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={saveEdit}
            class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            class="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <input
            type="checkbox"
            checked={props.todo.completed}
            onChange={() => props.onToggle(props.todo.id)}
            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <div class="flex-1 flex flex-col gap-0.5">
            <span
              class={`block text-left text-sm ${props.todo.completed
                ? "line-through text-gray-400"
                : "text-gray-800"
                }`}
              onDblClick={startEditing}
            >
              {props.todo.text}
            </span>
            <TimeDisplay timestamp={props.todo.createdAt} />
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={startEditing}
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => props.onDelete(props.todo.id)}
              class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
