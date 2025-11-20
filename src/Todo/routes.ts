import { createContext, type Router } from "rask-ui";

export const routes = {
    home: "/",
    todos: "/todos/:filter",
} as const;

export const RouterContext = createContext<Router<typeof routes>>();
