import { createContext, useRouter } from "rask-ui";

export const routes = {
    home: "/",
    todos: "/todos/:filter",
} as const;

export const RouterContext = createContext(() => useRouter(routes));
