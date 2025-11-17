import { BrowserRouter, Route, Switch } from "inferno-router";
import { TodoApp } from "./Todo/TodoApp";
import { updateRouterState } from "./Todo/routerState";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="card">
          <Switch>
            <Route
              path="/todos/:filter?"
              render={(routeProps) => {
                updateRouterState(routeProps);
                return <TodoApp />;
              }}
            />
            <Route
              path="/"
              render={(routeProps) => {
                updateRouterState(routeProps);
                return <TodoApp />;
              }}
            />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}
