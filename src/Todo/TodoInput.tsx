import { createState, createRef } from "rask-ui";

interface TodoInputProps {
  onAdd: (text: string) => void;
  inputRef?: any;
}

export function TodoInput(props: TodoInputProps) {
  const state = createState({
    inputValue: "",
  });

  const inputRef = props.inputRef || createRef<HTMLInputElement>();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (state.inputValue.trim()) {
      props.onAdd(state.inputValue.trim());
      state.inputValue = "";
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      state.inputValue = "";
      inputRef.current?.blur();
    }
  };

  return () => (
    <form onSubmit={handleSubmit} class="mb-6">
      <div class="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={state.inputValue}
          onInput={(e) => (state.inputValue = (e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!state.inputValue.trim()}
        >
          Add Todo
        </button>
      </div>
    </form>
  );
}
