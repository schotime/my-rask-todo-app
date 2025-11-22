import { TodoItem } from "./TodoItem";
import type { Todo } from "./types";

interface TodoListProps {
  todos: Todo[];
  selectedId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onSelect: (id: string) => void;
}

export function TodoList(props: TodoListProps) {
  return (
    <div>
      {props.todos.length === 0 ? (
        <div class="text-center py-12 text-gray-400">
          <p class="text-lg">No todos yet!</p>
          <p class="text-sm mt-2">Add one above to get started.</p>
        </div>
      ) : (
        <ul class="space-y-2">
          {props.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isSelected={props.selectedId === todo.id}
              onToggle={props.onToggle}
              onDelete={props.onDelete}
              onEdit={props.onEdit}
              onSelect={props.onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}