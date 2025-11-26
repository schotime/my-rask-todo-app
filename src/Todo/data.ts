import type { Todo } from "./types";

export const STORAGE_KEY = "rask-todos";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTodos = async (): Promise<Todo[]> => {
    try {
        await delay(1000); // Simulate network delay for demonstration
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load todos from localStorage:", e);
        throw new Error("Failed to load todos");
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

export const saveTodos = async (todos: Todo[]): Promise<void> => {
    try {
        await delay(1000); // Simulate network delay for demonstration
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
        console.error("Failed to save todos to localStorage:", e);
        throw new Error("Failed to save todos");
    }
};