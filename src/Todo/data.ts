import { STORAGE_KEY } from "./TodoApp";
import type { Todo } from "./types";

export const getInitialTodos = (): Todo[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load todos from localStorage:", e);
    }

    // Default todos if none stored
    const now = Date.now();
    return [
        {
            id: crypto.randomUUID(),
            text: "Welcome to RASK Todo App! 🎉",
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            text: "Double-click to edit a todo",
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            text: "Hover over todos to see actions",
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
    ];
};
