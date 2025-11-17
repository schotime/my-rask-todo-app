import { createState } from "rask-ui";

interface RouterState {
  match?: {
    params?: Record<string, string>;
  };
  location?: {
    pathname: string;
  };
  history?: {
    push: (path: string) => void;
  };
}

// Create a persistent router state that survives re-renders
const routerState = createState<RouterState>({});

export function updateRouterState(newProps: any) {
  return Object.assign(routerState, newProps);
}

export function getRouterState() {
  return routerState;
}
